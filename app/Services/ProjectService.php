<?php

namespace App\Services;

use App\Models\InstrumentTemplate;
use App\Models\Project;
use App\Models\ProjectLocation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProjectService
{
    public function __construct()
    {
        //
    }


    protected function generateProjectCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (Project::where('project_code', $code)->exists());

        return $code;
    }

    public function getAllProjectsByCompany(int $companyId)
    {
        return Project::with(['locations.district.city.province', 'submissions'])
            ->where('company_id', $companyId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($project) => $this->formatProjectForList($project));
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

    public function createProject(array $data, int $companyId, ?int $userId = null): Project
    {
        return DB::transaction(function () use ($data, $companyId, $userId) {
            $project = $this->storeProject($data, $companyId, $userId);
            $this->storeProjectLocations($data['district_ids'] ?? [], $project->id, $companyId);

            return $project->load('locations.district.city.province');
        });
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
}
