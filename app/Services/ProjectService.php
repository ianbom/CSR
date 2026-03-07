<?php

namespace App\Services;

use App\Models\InstrumentTemplate;
use App\Models\Project;
use App\Models\ProjectEnumeratorAssignment;
use App\Models\ProjectLocation;
use App\Models\Respondent;
use App\Models\Submission;
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
            'totalRespondents' => $projects->sum(fn ($p) => $p->submissions()->count()),
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
        return User::where('company_id', $companyId)
            ->where('role', 'enumerator')
            ->where('is_active', true)
            ->select('id', 'name', 'email', 'phone')
            ->orderBy('name')
            ->get()
            ->toArray();
    }

    public function assignEnumeratorsToProject(int $projectId, array $enumeratorIds, int $companyId): void
    {
        DB::transaction(function () use ($projectId, $enumeratorIds, $companyId) {
            ProjectEnumeratorAssignment::where('project_id', $projectId)
                ->where('company_id', $companyId)
                ->delete();

            if (! empty($enumeratorIds)) {
                $assignments = collect($enumeratorIds)->map(fn ($enumeratorId) => [
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

    public function updateProject(int $projectId, array $data, int $companyId): Project
    {
        return DB::transaction(function () use ($projectId, $data, $companyId) {
            $project = Project::where('id', $projectId)
                ->where('company_id', $companyId)
                ->firstOrFail();

            $templateIds = $this->resolveTemplateIds($data);

            $project->update([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'status' => $data['status'] ?? $project->status,
                'target_ikm_count' => $data['target_ikm_count'] ?? 0,
                'target_sloi_count' => $data['target_sloi_count'] ?? 0,
                'enable_ikm' => $data['enable_ikm'] ?? false,
                'enable_sloi' => $data['enable_sloi'] ?? false,
                'enable_sroi' => $data['enable_sroi'] ?? false,
                'ikm_template_id' => $templateIds['ikm'],
                'sloi_template_id' => $templateIds['sloi'],
                'start_date' => $data['start_date'] ?? null,
                'end_date' => $data['end_date'] ?? null,
            ]);

            // Sync locations if provided
            if (isset($data['district_ids'])) {
                ProjectLocation::where('project_id', $projectId)->delete();
                $this->storeProjectLocations($data['district_ids'], $projectId, $companyId);
            }

            return $project->load('locations.district.city.province');
        });
    }

    public function getProjectForEdit(int $projectId, int $companyId): array
    {
        $project = Project::where('id', $projectId)
            ->where('company_id', $companyId)
            ->with('locations.district.city.province')
            ->firstOrFail();

        $locations = $project->locations->map(function ($loc) {
            return [
                'id' => $loc->id,
                'province' => $loc->district->city->province,
                'city' => $loc->district->city,
                'district' => $loc->district,
            ];
        })->toArray();

        return [
            'id' => $project->id,
            'name' => $project->name,
            'description' => $project->description ?? '',
            'status' => $project->status ?? 'draft',
            'target_ikm_count' => $project->target_ikm_count,
            'target_sloi_count' => $project->target_sloi_count,
            'start_date' => $project->start_date?->format('Y-m-d') ?? '',
            'end_date' => $project->end_date?->format('Y-m-d') ?? '',
            'enable_ikm' => $project->enable_ikm,
            'enable_sloi' => $project->enable_sloi,
            'enable_sroi' => $project->enable_sroi,
            'ikm_template_id' => $project->ikm_template_id,
            'sloi_template_id' => $project->sloi_template_id,
            'locations' => $locations,
        ];
    }

    // ─── PROJECT DETAIL ───────────────────────────────────────────

    public function getProjectDetail(int $projectId, string $detailType = 'overview', array $respondentParams = []): array
    {
        $project = Project::with([
            'company',
            'locations.district.city.province',
            'enumeratorAssignments.enumerator',
            'ikmTemplate',
            'sloiTemplate',
        ])->findOrFail($projectId);

        $assessmentType = $this->resolveAssessmentType($detailType);

        // Base query: submissions for this project, optionally filtered by type
        $submissionsQuery = Submission::where('project_id', $projectId);
        if ($assessmentType) {
            $submissionsQuery->where('assessment_type', $assessmentType);
        }

        $submissions = $submissionsQuery->get();
        $submissionIds = $submissions->pluck('id');
        $respondentIds = $submissions->pluck('respondent_id')->filter()->unique();

        // Determine template_id for question scores
        $templateId = null;
        if ($assessmentType === 'IKM') {
            $templateId = $project->ikm_template_id;
        } elseif ($assessmentType === 'SLOI') {
            $templateId = $project->sloi_template_id;
        }

        return [
            'project' => $this->formatProjectDetail($project),
            'stats' => $this->computeStats($project, $submissions, $assessmentType),
            'demographics' => $this->computeDemographics($respondentIds),
            'questionScores' => $this->computeQuestionScores($submissionIds, $templateId),
            'auditLog' => $this->computeAuditLog($projectId, $assessmentType),
            'trendData' => $this->computeTrendData($projectId, $assessmentType),
            'respondents' => $this->computeRespondents($projectId, $assessmentType, $templateId, $respondentParams),
            'enumeratorList' => $this->computeEnumeratorList($project),
        ];
    }

    protected function resolveAssessmentType(string $detailType): ?string
    {
        return match (strtolower($detailType)) {
            'ikm', 'ikm_respondent' => 'IKM',
            'sloi', 'sloi_respondent' => 'SLOI',
            'sroi' => 'SROI',
            default => null, // overview, enumerator = all types
        };
    }

    protected function formatProjectDetail(Project $project): array
    {
        $locations = $project->locations->map(function ($loc) {
            $district = $loc->district;
            $city = $district?->city;
            $province = $city?->province;

            return [
                'district' => $district?->name,
                'city' => $city?->name,
                'province' => $province?->name,
            ];
        });

        $enumerators = $project->enumeratorAssignments->map(function ($a) {
            return [
                'id' => $a->enumerator?->id,
                'name' => $a->enumerator?->name,
                'email' => $a->enumerator?->email,
            ];
        })->filter(fn ($e) => $e['id'] !== null)->values();

        return [
            'id' => $project->id,
            'name' => $project->name,
            'description' => $project->description,
            'projectCode' => $project->project_code,
            'status' => $project->status,
            'companyName' => $project->company?->name,
            'enableIkm' => $project->enable_ikm,
            'enableSloi' => $project->enable_sloi,
            'enableSroi' => $project->enable_sroi,
            'targetIkmCount' => $project->target_ikm_count,
            'targetSloiCount' => $project->target_sloi_count,
            'startDate' => $project->start_date?->format('Y-m-d'),
            'endDate' => $project->end_date?->format('Y-m-d'),
            'locations' => $locations,
            'enumerators' => $enumerators,
        ];
    }

    protected function computeStats(Project $project, $submissions, ?string $assessmentType): array
    {
        $totalResponses = $submissions->count();

        // Target depends on type
        $targetResponses = match ($assessmentType) {
            'IKM' => $project->target_ikm_count,
            'SLOI' => $project->target_sloi_count,
            default => $project->target_ikm_count + $project->target_sloi_count,
            //
        };

        $progress = $targetResponses > 0
            ? round(($totalResponses / $targetResponses) * 100, 1)
            : 0;

        // Average score from all answers in these submissions
        $avgScore = 0;
        $submissionIds = $submissions->pluck('id');
        if ($submissionIds->isNotEmpty()) {
            $avgScore = round(
                \App\Models\SubmissionTemplateAnswer::whereIn('submission_id', $submissionIds)
                    ->avg('value') ?? 0,
                2
            );
        }

        // Score label
        $scoreLabel = $this->getScoreLabel($avgScore);

        return [
            'totalResponses' => $totalResponses,
            'targetResponses' => $targetResponses ?: 0,
            'progress' => $progress,
            'score' => $avgScore,
            'scoreLabel' => $scoreLabel,
        ];
    }

    protected function getScoreLabel(float $score): string
    {
        if ($score >= 4.0) {
            return 'Sangat Baik';
        }
        if ($score >= 3.0) {
            return 'Baik';
        }
        if ($score >= 2.0) {
            return 'Cukup';
        }
        if ($score >= 1.0) {
            return 'Kurang';
        }

        return 'Belum Ada Data';
    }

    protected function computeDemographics($respondentIds): array
    {
        if ($respondentIds->isEmpty()) {
            return [
                'genderDistribution' => [],
                'ageRange' => [],
                'educationLevel' => [],
            ];
        }

        $respondents = Respondent::whereIn('id', $respondentIds)->get();
        $total = $respondents->count();

        // Gender distribution — normalize raw DB values
        $genderMap = [
            'male' => 'Laki-laki',
            'female' => 'Perempuan',
            'laki-laki' => 'Laki-laki',
            'perempuan' => 'Perempuan',
        ];

        $normalizedGenders = $respondents->map(function ($r) use ($genderMap) {
            $raw = strtolower(trim($r->gender ?? ''));

            return $genderMap[$raw] ?? ($r->gender ?: 'Tidak Diketahui');
        });

        $genderCounts = $normalizedGenders->countBy();
        $genderDistribution = $genderCounts->map(function ($count, $gender) use ($total) {
            return [
                'gender' => $gender,
                'count' => $count,
                'percentage' => $total > 0 ? round(($count / $total) * 100, 1) : 0,
            ];
        })->values()->toArray();

        // Age range buckets
        $ageBuckets = [
            '17-25' => 0, '26-35' => 0, '36-45' => 0, '46-55' => 0, '56-65' => 0, '>65' => 0,
        ];
        foreach ($respondents as $r) {
            if ($r->age === null) {
                continue;
            }
            if ($r->age <= 25) {
                $ageBuckets['17-25']++;
            } elseif ($r->age <= 35) {
                $ageBuckets['26-35']++;
            } elseif ($r->age <= 45) {
                $ageBuckets['36-45']++;
            } elseif ($r->age <= 55) {
                $ageBuckets['46-55']++;
            } elseif ($r->age <= 65) {
                $ageBuckets['56-65']++;
            } else {
                $ageBuckets['>65']++;
            }
        }
        $ageRange = collect($ageBuckets)->map(function ($count, $range) {
            return [
                'range' => $range,
                'count' => $count,
            ];
        })->values()->toArray();

        $eduMap = [
            'sd' => 'SD',
            'smp' => 'SMP',
            'sma' => 'SMA',
            'smk' => 'SMA',
            'd1' => 'D1-D3',
            'd2' => 'D1-D3',
            'd3' => 'D1-D3',
            'd4' => 'D4/S1',
            's1' => 'D4/S1',
            's2' => 'S2',
            's3' => 'S3',
        ];

        $normalized = $respondents->map(function ($r) use ($eduMap) {
            $raw = strtolower(trim($r->education_level ?? ''));

            return $eduMap[$raw] ?? ($r->education_level ?: 'Tidak Diketahui');
        });

        $eduGroups = $normalized->countBy();
        $educationLevel = $eduGroups->map(function ($count, $label) use ($total) {
            return [
                'label' => $label,
                'value' => $count,
                'percentage' => $total > 0 ? round(($count / $total) * 100, 1) : 0,
            ];
        })->values()->toArray();

        return [
            'genderDistribution' => $genderDistribution,
            'ageRange' => $ageRange,
            'educationLevel' => $educationLevel,
        ];
    }

    protected function computeQuestionScores($submissionIds, ?int $templateId): array
    {
        if ($submissionIds->isEmpty() || ! $templateId) {
            return [];
        }

        // Get all questions for this template
        $questions = \App\Models\TemplateQuestion::where('template_id', $templateId)
            ->orderBy('order_no')
            ->get();

        $questionIds = $questions->pluck('id');

        // Average score per question — overall
        $avgAll = \App\Models\SubmissionTemplateAnswer::whereIn('submission_id', $submissionIds)
            ->whereIn('question_id', $questionIds)
            ->groupBy('question_id')
            ->selectRaw('question_id, ROUND(AVG(value), 2) as avg_score')
            ->pluck('avg_score', 'question_id');

        // Average score per question — type ikm-kepentingan
        $avgKepentingan = \App\Models\SubmissionTemplateAnswer::whereIn('submission_id', $submissionIds)
            ->whereIn('question_id', $questionIds)
            ->where('type', 'ikm-kepentingan')
            ->groupBy('question_id')
            ->selectRaw('question_id, ROUND(AVG(value), 2) as avg_score')
            ->pluck('avg_score', 'question_id');

        // Average score per question — type ikm-kinerja
        $avgKinerja = \App\Models\SubmissionTemplateAnswer::whereIn('submission_id', $submissionIds)
            ->whereIn('question_id', $questionIds)
            ->where('type', 'ikm-kinerja')
            ->groupBy('question_id')
            ->selectRaw('question_id, ROUND(AVG(value), 2) as avg_score')
            ->pluck('avg_score', 'question_id');

        return $questions->map(function ($q) use ($avgAll, $avgKepentingan, $avgKinerja) {
            return [
                'id' => $q->code,
                'question' => $q->question_text,
                'score' => (float) ($avgAll[$q->id] ?? 0),
                'importance' => (float) ($avgKepentingan[$q->id] ?? 0),
                'performance' => (float) ($avgKinerja[$q->id] ?? 0),
            ];
        })->toArray();
    }

    protected function computeAuditLog(int $projectId, ?string $assessmentType): array
    {
        $query = Submission::where('project_id', $projectId)
            ->with(['respondent', 'enumerator'])
            ->orderByDesc('submitted_at')
            ->limit(10);

        if ($assessmentType) {
            $query->where('assessment_type', $assessmentType);
        }

        return $query->get()->map(function ($sub) {
            // Compute avg score for this submission
            $avgScore = $sub->templateAnswers()->avg('value');

            return [
                'id' => '#'.strtoupper($sub->assessment_type).'-'.$sub->id,
                'respondentName' => $sub->respondent?->name ?? '-',
                'enumerator' => $sub->enumerator?->name ?? '-',
                'date' => $sub->submitted_at?->format('M d, Y • H:i'),
                'score' => round($avgScore ?? 0, 1),
                'status' => $sub->status,
                'group' => $sub->respondent?->respondent_status === 'Penerima CSR' ? 'csr' : 'general',
            ];
        })->toArray();
    }

    protected function computeTrendData(int $projectId, ?string $assessmentType): array
    {
        $query = DB::table('submissions')
            ->join('submission_template_answers', 'submissions.id', '=', 'submission_template_answers.submission_id')
            ->where('submissions.project_id', $projectId)
            ->whereNotNull('submissions.submitted_at');

        if ($assessmentType) {
            $query->where('submissions.assessment_type', $assessmentType);
        }

        $monthly = $query
            ->selectRaw("DATE_FORMAT(submissions.submitted_at, '%Y-%m') as month_key")
            ->selectRaw("DATE_FORMAT(submissions.submitted_at, '%b') as month")
            ->selectRaw('ROUND(AVG(submission_template_answers.value), 2) as score')
            ->groupBy('month_key', 'month')
            ->orderBy('month_key')
            ->limit(6)
            ->get();

        if ($monthly->isEmpty()) {
            return [];
        }

        $maxScore = $monthly->max('score') ?: 1;

        return $monthly->map(function ($row) use ($maxScore) {
            return [
                'month' => strtoupper($row->month),
                'score' => (float) $row->score,
                'height' => round(($row->score / $maxScore) * 100),
            ];
        })->toArray();
    }

    protected function computeRespondents(int $projectId, ?string $assessmentType, ?int $templateId, array $params = []): array
    {
        $query = Submission::where('project_id', $projectId)
            ->with(['respondent', 'enumerator', 'templateAnswers.question', 'timelines.decidedBy']);

        if ($assessmentType) {
            $query->where('assessment_type', $assessmentType);
        }

        // ─── Filter options (computed before applying filters) ───
        $filterOptionsQuery = Submission::where('project_id', $projectId)
            ->with(['respondent', 'enumerator']);
        if ($assessmentType) {
            $filterOptionsQuery->where('assessment_type', $assessmentType);
        }
        $allSubmissions = $filterOptionsQuery->get();

        $enumeratorOptions = $allSubmissions
            ->map(fn ($s) => $s->enumerator?->name)
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->toArray();

        $statusOptions = $allSubmissions
            ->pluck('status')
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->toArray();

        $educationOptions = $allSubmissions
            ->map(fn ($s) => $s->respondent?->education_level)
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->toArray();

        $genderOptions = $allSubmissions
            ->map(fn ($s) => $s->respondent?->gender)
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->toArray();

        // ─── Apply filters ───────────────────────────────────
        $filterEnumerator = $params['enumerator'] ?? null;
        $filterStatus = $params['status'] ?? null;
        $filterEducation = $params['education'] ?? null;
        $filterGender = $params['gender'] ?? null;

        if (! empty($filterEnumerator)) {
            $query->whereHas('enumerator', function ($q) use ($filterEnumerator) {
                $q->where('name', $filterEnumerator);
            });
        }

        if (! empty($filterStatus)) {
            $query->where('status', $filterStatus);
        }

        if (! empty($filterEducation)) {
            $query->whereHas('respondent', function ($q) use ($filterEducation) {
                $q->where('education_level', $filterEducation);
            });
        }

        if (! empty($filterGender)) {
            $query->whereHas('respondent', function ($q) use ($filterGender) {
                $q->where('gender', $filterGender);
            });
        }

        // ─── Sorting ─────────────────────────────────────────
        $sortBy = $params['sort_by'] ?? 'submitted_at';
        $sortOrder = $params['sort_order'] ?? 'desc';

        if ($sortBy === 'submitted_at') {
            $query->orderBy('submitted_at', $sortOrder);
        } else {
            // For avgScore, we fall back to default order; scoring is computed after fetch
            $query->orderByDesc('submitted_at');
        }

        // ─── Pagination ──────────────────────────────────────
        $perPage = (int) ($params['per_page'] ?? 10);
        $paginated = $query->paginate($perPage)->withQueryString();

        // Get question headers if template exists
        $questions = [];
        if ($templateId) {
            $questions = \App\Models\TemplateQuestion::where('template_id', $templateId)
                ->orderBy('order_no')
                ->get()
                ->map(fn ($q) => [
                    'code' => $q->code,
                    'question' => $q->question_text,
                ])
                ->toArray();
        }

        $rows = $paginated->getCollection()->map(function ($sub) {
            $respondent = $sub->respondent;

            // Build answer map: question_code => { kepentingan, kinerja }
            $answers = [];
            $totalScore = 0;
            $answerCount = 0;
            $kepScore = 0;
            $kepCount = 0;
            $kinScore = 0;
            $kinCount = 0;

            foreach ($sub->templateAnswers as $answer) {
                $code = $answer->question?->code ?? 'Q'.$answer->question_id;
                $type = $answer->type ?? 'sloi';

                if (! isset($answers[$code])) {
                    $answers[$code] = ['kepentingan' => null, 'kinerja' => null];
                }

                if ($type === 'ikm-kepentingan') {
                    $answers[$code]['kepentingan'] = $answer->value;
                    $kepScore += $answer->value ?? 0;
                    $kepCount++;
                } elseif ($type === 'ikm-kinerja') {
                    $answers[$code]['kinerja'] = $answer->value;
                    $kinScore += $answer->value ?? 0;
                    $kinCount++;
                } else {
                    $answers[$code]['kepentingan'] = $answer->value;
                    $answers[$code]['kinerja'] = $answer->value;
                }

                $totalScore += $answer->value ?? 0;
                $answerCount++;
            }

            return [
                'submissionId' => $sub->id,
                'submittedAt' => $sub->submitted_at?->format('Y-m-d H:i'),
                'status' => $sub->status,
                'enumerator' => $sub->enumerator?->name ?? '-',
                'latitude' => $sub->latitude,
                'longitude' => $sub->longitude,
                'photoPath' => $sub->photo_path,
                'avgScore' => $answerCount > 0 ? round($totalScore / $answerCount, 2) : 0,
                'avgKepentingan' => $kepCount > 0 ? round($kepScore / $kepCount, 2) : null,
                'avgKinerja' => $kinCount > 0 ? round($kinScore / $kinCount, 2) : null,
                'respondent' => $respondent ? [
                    'id' => $respondent->id,
                    'name' => $respondent->name,
                    'address' => $respondent->address,
                    'phone' => $respondent->phone,
                    'age' => $respondent->age,
                    'gender' => $respondent->gender,
                    'status' => $respondent->respondent_status,
                    'educationLevel' => $respondent->education_level,
                    'occupation' => $respondent->main_occupation,
                    'monthlyIncome' => $respondent->monthly_income,
                ] : null,
                'answers' => $answers,
                'timelines' => $sub->timelines->sortByDesc('decided_at')->values()->map(fn ($t) => [
                    'id' => $t->id,
                    'action' => $t->action,
                    'decidedAt' => $t->decided_at?->format('Y-m-d H:i'),
                    'decidedBy' => $t->decidedBy?->name ?? '-',
                    'notes' => $t->notes,
                ])->toArray(),
            ];
        })->toArray();

        // If sortBy is avgScore, sort the current page rows in PHP
        if ($sortBy === 'avg_score') {
            usort($rows, function ($a, $b) use ($sortOrder) {
                $cmp = $a['avgScore'] <=> $b['avgScore'];

                return $sortOrder === 'asc' ? $cmp : -$cmp;
            });
        }

        return [
            'questions' => $questions,
            'rows' => $rows,
            'pagination' => [
                'currentPage' => $paginated->currentPage(),
                'lastPage' => $paginated->lastPage(),
                'perPage' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
            'filterOptions' => [
                'enumerators' => $enumeratorOptions,
                'statuses' => $statusOptions,
                'educations' => $educationOptions,
                'genders' => $genderOptions,
            ],
        ];
    }

    protected function computeEnumeratorList(Project $project): array
    {
        $assignments = ProjectEnumeratorAssignment::where('project_id', $project->id)
            ->with('enumerator')
            ->get();

        $allSubmissions = Submission::where('project_id', $project->id)
            ->with('respondent')
            ->get()
            ->groupBy('enumerator_id');

        return $assignments->map(function ($assignment) use ($allSubmissions) {
            $enumerator = $assignment->enumerator;
            $submissions = $allSubmissions->get($enumerator->id, collect());

            $totalSubmissions = $submissions->count();
            $latestSubmission = $submissions->sortByDesc('submitted_at')->first();
            $avgScore = 0;
            if ($totalSubmissions > 0) {
                $submissionIds = $submissions->pluck('id');
                $avg = \App\Models\SubmissionTemplateAnswer::whereIn('submission_id', $submissionIds)
                    ->avg('value');
                $avgScore = round((float) $avg, 2);
            }

            return [
                'id' => $enumerator->id,
                'name' => $enumerator->name,
                'email' => $enumerator->email,
                'phone' => $enumerator->phone,
                'isActive' => $enumerator->is_active,
                'totalSubmissions' => $totalSubmissions,
                'avgScore' => $avgScore,
                'lastSubmittedAt' => $latestSubmission?->submitted_at?->format('Y-m-d H:i'),
                'submissions' => $submissions->map(function ($sub) {
                    return [
                        'id' => $sub->id,
                        'respondentName' => $sub->respondent?->name ?? '-',
                        'assessmentType' => $sub->assessment_type,
                        'status' => $sub->status,
                        'submittedAt' => $sub->submitted_at?->format('Y-m-d H:i'),
                    ];
                })->values()->toArray(),
            ];
        })->toArray();
    }

    // ─── PROJECT LIST ───────────────────────────────────────────

    protected function buildProjectListQuery(Builder $query, array $params = []): LengthAwarePaginator
    {
        $query->with(self::LIST_RELATIONS);

        $this->applySearchFilter($query, $params['search'] ?? null);

        $this->applyStatusFilter($query, $params['status'] ?? null);

        $this->applySorting($query, $params['sort_by'] ?? null, $params['sort_order'] ?? null);

        $perPage = $params['per_page'] ?? 10;
        $paginated = $query->paginate($perPage)->withQueryString();

        $paginated->getCollection()->transform(fn ($project) => $this->formatProjectForList($project));

        return $paginated;
    }

    protected function applySearchFilter(Builder $query, ?string $search): void
    {
        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('project_code', 'like', "%{$search}%");
            });
        }
    }

    protected function applyStatusFilter(Builder $query, ?string $status): void
    {
        if (! empty($status) && $status !== 'all') {
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
        $locationsString = $project->locations->map(function ($loc) {
            $district = $loc->district;
            $city = $district?->city;

            return $city ? $city->name : ($district?->name ?? '-');
        })->unique()->take(2)->implode(', ');

        $fullLocations = $project->locations->map(function ($loc) {
            return [
                'id' => $loc->id,
                'province' => $loc->district?->city?->province,
                'city' => $loc->district?->city,
                'district' => $loc->district,
            ];
        })->toArray();

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
            'location' => $locationsString ?: '-',
            'status' => $project->status,
            'description' => $project->description,
            'target_ikm_count' => $project->target_ikm_count,
            'target_sloi_count' => $project->target_sloi_count,
            'enable_ikm' => $project->enable_ikm,
            'enable_sloi' => $project->enable_sloi,
            'enable_sroi' => $project->enable_sroi,
            'ikm_template_id' => $project->ikm_template_id,
            'sloi_template_id' => $project->sloi_template_id,
            'locations' => $fullLocations,
            'currentResponses' => $currentResponses,
            'targetResponses' => $targetResponses ?: 0,
            'startDate' => $project->start_date?->format('Y-m-d'),
            'endDate' => $project->end_date?->format('Y-m-d'),
        ];
    }

    protected function determineProjectType(Project $project): string
    {
        if ($project->enable_ikm) {
            return 'IKM';
        }
        if ($project->enable_sloi) {
            return 'SLOI';
        }
        if ($project->enable_sroi) {
            return 'SROI';
        }

        return 'IKM';
    }

    protected function getTypeLabel(Project $project): string
    {
        $types = [];
        if ($project->enable_ikm) {
            $types[] = 'IKM';
        }
        if ($project->enable_sloi) {
            $types[] = 'SLOI';
        }
        if ($project->enable_sroi) {
            $types[] = 'SROI';
        }

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

        if (! empty($data['enable_ikm'])) {
            $ikmTemplateId = InstrumentTemplate::where('type', 'IKM')
                ->where('is_active', true)
                ->value('id');
        }

        if (! empty($data['enable_sloi'])) {
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

        $locations = collect($districtIds)->map(fn ($districtId) => [
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
