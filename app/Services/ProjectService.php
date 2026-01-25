<?php

namespace App\Services;

use App\Models\InstrumentTemplate;
use App\Models\Project;
use App\Models\ProjectEnumeratorAssignment;
use App\Models\ProjectLocation;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProjectService
{
    protected const ALLOWED_SORTS = ['name', 'project_code', 'status', 'created_at', 'start_date', 'end_date'];

    protected const LIST_RELATIONS = ['locations.district.city.province', 'submissions', 'company'];

    public function getAllProjectsByCompany(int $companyId, array $params = []): LengthAwarePaginator
    {
        $query = Project::query()->where('company_id', $companyId);
        
        return $this->buildProjectListQuery($query, $params);
    }

    public function getProjectsByEnumerator(int $enumeratorId, array $params = []): LengthAwarePaginator
    {
        $assignedProjectIds = ProjectEnumeratorAssignment::where('enumerator_id', $enumeratorId)
            ->pluck('project_id');

        $query = Project::query()
            ->whereIn('id', $assignedProjectIds)
            ->where('status', '!=', 'draft');
        
        return $this->buildProjectListQuery($query, $params);
    }

    public function getProjectSummary(int $companyId): array
    {
        $projects = Project::where('company_id', $companyId)->get();

        return [
            'totalProjects' => $projects->count(),
            'activeProjects' => $projects->where('status', 'active')->count(),
            'draftProjects' => $projects->where('status', 'draft')->count(),
            'closedProjects' => $projects->where('status', 'closed')->count(),
            'totalRespondents' => $projects->sum(fn($p) => $p->submissions()->count()),
        ];
    }

    public function getEnumeratorsByCompany(int $companyId): array
    {
        return User::where('company_id', $companyId)
            ->where('role', 'enumerator')
            ->where('is_active', true)
            ->select('id', 'name', 'email', 'phone')
            ->orderBy('name')
            ->get()
            ->toArray();
    }

    public function getProjectEnumerators(int $projectId, int $companyId): array
    {
        return ProjectEnumeratorAssignment::where('project_id', $projectId)
            ->where('company_id', $companyId)
            ->with('enumerator:id,name,email,phone')
            ->get()
            ->pluck('enumerator')
            ->filter()
            ->values()
            ->toArray();
    }

    public function assignEnumeratorsToProject(int $projectId, array $enumeratorIds, int $companyId): void
    {
        DB::transaction(function () use ($projectId, $enumeratorIds, $companyId) {
            ProjectEnumeratorAssignment::where('project_id', $projectId)
                ->where('company_id', $companyId)
                ->delete();

            if (!empty($enumeratorIds)) {
                $assignments = collect($enumeratorIds)->map(fn($enumeratorId) => [
                    'company_id' => $companyId,
                    'project_id' => $projectId,
                    'enumerator_id' => $enumeratorId,
                    'created_at' => now(),
                ])->toArray();

                ProjectEnumeratorAssignment::insert($assignments);
            }
        });
    }

    public function createProject(array $data, int $companyId, ?int $userId = null): Project
    {
        return DB::transaction(function () use ($data, $companyId, $userId) {
            $project = $this->storeProject($data, $companyId, $userId);
            $this->storeProjectLocations($data['district_ids'] ?? [], $project->id, $companyId);

            return $project->load('locations.district.city.province');
        });
    }

    protected function buildProjectListQuery(Builder $query, array $params = []): LengthAwarePaginator
    {
        $query->with(self::LIST_RELATIONS);

        $this->applySearchFilter($query, $params['search'] ?? null);

        $this->applyStatusFilter($query, $params['status'] ?? null);

        $this->applySorting($query, $params['sort_by'] ?? null, $params['sort_order'] ?? null);

        $perPage = $params['per_page'] ?? 10;
        $paginated = $query->paginate($perPage)->withQueryString();

        $paginated->getCollection()->transform(fn($project) => $this->formatProjectForList($project));

        return $paginated;
    }

    protected function applySearchFilter(Builder $query, ?string $search): void
    {
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('project_code', 'like', "%{$search}%");
            });
        }
    }


    protected function applyStatusFilter(Builder $query, ?string $status): void
    {
        if (!empty($status) && $status !== 'all') {
            $query->where('status', $status);
        }
    }

    protected function applySorting(Builder $query, ?string $sortBy, ?string $sortOrder): void
    {
        $sortBy = $sortBy ?? 'created_at';
        $sortOrder = $sortOrder ?? 'desc';

        if (in_array($sortBy, self::ALLOWED_SORTS)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }
    }

    protected function formatProjectForList(Project $project): array
    {
        $locations = $project->locations->map(function ($loc) {
            $district = $loc->district;
            $city = $district?->city;
            return $city ? $city->name : ($district?->name ?? '-');
        })->unique()->take(2)->implode(', ');

        $type = $this->determineProjectType($project);
        $currentResponses = $project->submissions->count();
        $targetResponses = $project->target_ikm_count + $project->target_sloi_count;

        return [
            'id' => $project->id,
            'code' => $project->project_code,
            'institution' => $project->company->name ?? '-',
            'name' => $project->name,
            'type' => $type,
            'typeLabel' => $this->getTypeLabel($project),
            'location' => $locations ?: '-',
            'status' => $project->status,
            'currentResponses' => $currentResponses,
            'targetResponses' => $targetResponses ?: 0,
            'startDate' => $project->start_date?->format('Y-m-d'),
            'endDate' => $project->end_date?->format('Y-m-d'),
        ];
    }

    protected function determineProjectType(Project $project): string
    {
        if ($project->enable_ikm) return 'IKM';
        if ($project->enable_sloi) return 'SLOI';
        if ($project->enable_sroi) return 'SROI';
        return 'IKM';
    }

    protected function getTypeLabel(Project $project): string
    {
        $types = [];
        if ($project->enable_ikm) $types[] = 'IKM';
        if ($project->enable_sloi) $types[] = 'SLOI';
        if ($project->enable_sroi) $types[] = 'SROI';
        return implode(' + ', $types) ?: 'IKM';
    }

    protected function storeProject(array $data, int $companyId, ?int $userId): Project
    {
        $templateIds = $this->resolveTemplateIds($data);

        return Project::create([
            'company_id' => $companyId,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'project_code' => $this->generateProjectCode(),
            'status' => 'draft',
            'target_ikm_count' => $data['target_ikm_count'] ?? 0,
            'target_sloi_count' => $data['target_sloi_count'] ?? 0,
            'enable_ikm' => $data['enable_ikm'] ?? false,
            'enable_sloi' => $data['enable_sloi'] ?? false,
            'enable_sroi' => $data['enable_sroi'] ?? false,
            'ikm_template_id' => $templateIds['ikm'],
            'sloi_template_id' => $templateIds['sloi'],
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'created_by' => $userId,
        ]);
    }

    protected function resolveTemplateIds(array $data): array
    {
        $ikmTemplateId = null;
        $sloiTemplateId = null;

        if (!empty($data['enable_ikm'])) {
            $ikmTemplateId = InstrumentTemplate::where('type', 'IKM')
                ->where('is_active', true)
                ->value('id');
        }

        if (!empty($data['enable_sloi'])) {
            $sloiTemplateId = InstrumentTemplate::where('type', 'SLOI')
                ->where('is_active', true)
                ->value('id');
        }

        return [
            'ikm' => $ikmTemplateId,
            'sloi' => $sloiTemplateId,
        ];
    }

    protected function storeProjectLocations(array $districtIds, int $projectId, int $companyId): void
    {
        if (empty($districtIds)) {
            return;
        }

        $locations = collect($districtIds)->map(fn($districtId) => [
            'company_id' => $companyId,
            'project_id' => $projectId,
            'district_id' => $districtId,
            'created_at' => now(),
            'updated_at' => now(),
        ])->toArray();

        ProjectLocation::insert($locations);
    }

    protected function generateProjectCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (Project::where('project_code', $code)->exists());

        return $code;
    }
}
