<?php

namespace App\Services;

use App\Models\Submission;
use App\Models\SubmissionTemplateAnswer;
use App\Models\TemplateQuestion;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class EnumeratorService
{
    /**
     * Get all enumerators for a company with stats.
     */
    public function getEnumeratorsByCompany(int $companyId, array $params = []): array
    {
        $query = User::where('company_id', $companyId)
            ->where('role', 'enumerator')
            ->withCount([
                'submissions',
                'assignedProjects as active_projects_count' => function ($q) {
                    $q->where('projects.status', 'active');
                },
            ]);

        if (! empty($params['search'])) {
            $search = $params['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $query->orderBy('name', 'asc');

        return $query->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'isActive' => $user->is_active,
                'submissions' => $user->submissions_count ?? 0,
                'activeProjects' => $user->active_projects_count ?? 0,
                'createdAt' => $user->created_at?->format('Y-m-d'),
            ];
        })->toArray();
    }

    /**
     * Get a single enumerator for editing.
     */
    public function getEnumeratorForEdit(int $enumeratorId, int $companyId): array
    {
        $user = User::where('id', $enumeratorId)
            ->where('company_id', $companyId)
            ->where('role', 'enumerator')
            ->firstOrFail();

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? '',
            'is_active' => $user->is_active,
        ];
    }

    /**
     * Create a new enumerator.
     */
    public function createEnumerator(array $data, int $companyId): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'role' => 'enumerator',
            'company_id' => $companyId,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    /**
     * Update an existing enumerator.
     */
    public function updateEnumerator(int $enumeratorId, array $data, int $companyId): User
    {
        $user = User::where('id', $enumeratorId)
            ->where('company_id', $companyId)
            ->where('role', 'enumerator')
            ->firstOrFail();

        $updateData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ];

        if (! empty($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        $user->update($updateData);

        return $user;
    }

    /**
     * Delete (soft-delete) an enumerator.
     */
    public function deleteEnumerator(int $enumeratorId, int $companyId): void
    {
        $user = User::where('id', $enumeratorId)
            ->where('company_id', $companyId)
            ->where('role', 'enumerator')
            ->firstOrFail();

        $user->delete();
    }

    /**
     * Get enumerator detail with profile, stats, and tab-specific data.
     *
     * @return array{profile: array, stats: array, respondents: array|null, respondentFilters: array}
     */
    public function getEnumeratorDetail(int $enumeratorId, int $companyId, string $tab, array $respondentParams = []): array
    {
        $user = User::where('id', $enumeratorId)
            ->where('company_id', $companyId)
            ->where('role', 'enumerator')
            ->withCount([
                'submissions',
                'submissions as ikm_submissions_count' => fn ($q) => $q->where('assessment_type', 'IKM'),
                'submissions as sloi_submissions_count' => fn ($q) => $q->where('assessment_type', 'SLOI'),
                'submissions as approved_submissions_count' => fn ($q) => $q->where('status', 'approved'),
                'submissions as rejected_submissions_count' => fn ($q) => $q->where('status', 'rejected'),
                'submissions as pending_submissions_count' => fn ($q) => $q->where('status', 'submitted'),
                'assignedProjects',
                'assignedProjects as active_projects_count' => fn ($q) => $q->where('projects.status', 'active'),
            ])
            ->firstOrFail();

        $profile = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'isActive' => $user->is_active,
            'createdAt' => $user->created_at?->format('Y-m-d'),
        ];

        $ikmSubmissionIds = $user->submissions()->where('assessment_type', 'IKM')->pluck('id');
        $sloiSubmissionIds = $user->submissions()->where('assessment_type', 'SLOI')->pluck('id');

        $avgScoreIkm = $ikmSubmissionIds->isNotEmpty()
            ? round(SubmissionTemplateAnswer::whereIn('submission_id', $ikmSubmissionIds)->avg('value') ?? 0, 2)
            : 0;

        $avgScoreSloi = $sloiSubmissionIds->isNotEmpty()
            ? round(SubmissionTemplateAnswer::whereIn('submission_id', $sloiSubmissionIds)->avg('value') ?? 0, 2)
            : 0;

        $assignedProjects = $user->assignedProjects()
            ->select('projects.id', 'projects.name', 'projects.project_code', 'projects.status')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'projectCode' => $p->project_code,
                'status' => $p->status,
            ])
            ->toArray();

        $stats = [
            'totalSubmissions' => $user->submissions_count,
            'ikmSubmissions' => $user->ikm_submissions_count,
            'sloiSubmissions' => $user->sloi_submissions_count,
            'approvedSubmissions' => $user->approved_submissions_count,
            'rejectedSubmissions' => $user->rejected_submissions_count,
            'pendingSubmissions' => $user->pending_submissions_count,
            'totalProjects' => $user->assigned_projects_count,
            'activeProjects' => $user->active_projects_count,
            'avgScoreIkm' => $avgScoreIkm,
            'avgScoreSloi' => $avgScoreSloi,
        ];

        $respondents = null;
        $respondentFilters = [
            'enumerator' => '',
            'resp_status' => $respondentParams['status'] ?? '',
            'education' => $respondentParams['education'] ?? '',
            'gender' => $respondentParams['gender'] ?? '',
            'sort_by' => $respondentParams['sort_by'] ?? 'submitted_at',
            'sort_order' => $respondentParams['sort_order'] ?? 'desc',
            'per_page' => (int) ($respondentParams['per_page'] ?? 10),
        ];

        if ($tab === 'ikm' || $tab === 'sloi') {
            $assessmentType = $tab === 'ikm' ? 'IKM' : 'SLOI';
            $respondents = $this->computeEnumeratorRespondents($user->id, $assessmentType, $respondentParams);
        }

        return [
            'profile' => $profile,
            'stats' => $stats,
            'assignedProjects' => $assignedProjects,
            'tab' => $tab,
            'respondents' => $respondents,
            'respondentFilters' => $respondentFilters,
        ];
    }

    /**
     * Compute respondent data for a specific enumerator and assessment type.
     */
    protected function computeEnumeratorRespondents(int $enumeratorId, string $assessmentType, array $params = []): array
    {
        $query = Submission::where('enumerator_id', $enumeratorId)
            ->where('assessment_type', $assessmentType)
            ->with(['respondent', 'enumerator', 'templateAnswers.question', 'timelines.decidedBy']);

        // Filter options from all submissions of this enumerator + type
        $allSubmissions = Submission::where('enumerator_id', $enumeratorId)
            ->where('assessment_type', $assessmentType)
            ->with(['respondent', 'enumerator'])
            ->get();

        $enumeratorOptions = $allSubmissions
            ->map(fn ($s) => $s->enumerator?->name)
            ->filter()->unique()->sort()->values()->toArray();

        $statusOptions = $allSubmissions
            ->pluck('status')->filter()->unique()->sort()->values()->toArray();

        $educationOptions = $allSubmissions
            ->map(fn ($s) => $s->respondent?->education_level)
            ->filter()->unique()->sort()->values()->toArray();

        $genderOptions = $allSubmissions
            ->map(fn ($s) => $s->respondent?->gender)
            ->filter()->unique()->sort()->values()->toArray();

        // Apply filters
        if (! empty($params['status'])) {
            $query->where('status', $params['status']);
        }

        if (! empty($params['education'])) {
            $query->whereHas('respondent', fn ($q) => $q->where('education_level', $params['education']));
        }

        if (! empty($params['gender'])) {
            $query->whereHas('respondent', fn ($q) => $q->where('gender', $params['gender']));
        }

        // Sorting
        $sortBy = $params['sort_by'] ?? 'submitted_at';
        $sortOrder = $params['sort_order'] ?? 'desc';

        if ($sortBy === 'submitted_at') {
            $query->orderBy('submitted_at', $sortOrder);
        } else {
            $query->orderByDesc('submitted_at');
        }

        // Pagination
        $perPage = (int) ($params['per_page'] ?? 10);
        $paginated = $query->paginate($perPage)->withQueryString();

        // Get template questions from submissions' projects
        $projectIds = $allSubmissions->pluck('project_id')->unique();
        $templateId = null;
        if ($projectIds->isNotEmpty()) {
            $templateColumn = $assessmentType === 'IKM' ? 'ikm_template_id' : 'sloi_template_id';
            $templateId = \App\Models\Project::whereIn('id', $projectIds)->whereNotNull($templateColumn)->value($templateColumn);
        }

        $questions = [];
        if ($templateId) {
            $questions = TemplateQuestion::where('template_id', $templateId)
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

        // Client-side sort for avgScore
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
}
