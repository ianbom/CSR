<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Respondent;
use App\Models\Submission;
use App\Models\SubmissionTemplateAnswer;
use App\Models\TemplateQuestion;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class SurveyService
{
    public function __construct()
    {
        //
    }

    public function checkProjectCode($projectCode, $projectId)
    {
        $project = Project::findOrFail($projectId);
        if ($project->project_code == $projectCode) {
            return true;
        }
        return false;
    }

    /**
     * Load pertanyaan berdasarkan surveyType (IKM / SLOI).
     * Mengambil template_id dari project, lalu load questions-nya.
     */
    public function getQuestionsBySurveyType(Project $project, string $surveyType)
    {
        $templateId = match (strtoupper($surveyType)) {
            'IKM'  => $project->ikm_template_id,
            'SLOI' => $project->sloi_template_id,
            default => null,
        };

        if (!$templateId) {
            return collect([]);
        }

        return TemplateQuestion::where('template_id', $templateId)
            ->orderBy('order_no')
            ->get(['id', 'category', 'code', 'question_text', 'order_no']);
    }

    /**
     * Store survey data: respondent (once), submission (once), answers (many).
     */
    public function storeSurvey(array $data, Project $project, int $enumeratorId): array
    {
        return DB::transaction(function () use ($data, $project, $enumeratorId) {
            $respondentData = $data['respondent'];
            $submissionData = $data['submission'];
            $answers        = $data['answers'];
            $assessmentType = $data['assessment_type'] ?? ($project->enable_ikm ? 'IKM' : ($project->enable_sloi ? 'SLOI' : 'SROI'));

            // 1. Respondent — sekali saja per project + phone
            $uniqueKeys = [
                'project_id' => $project->id,
                'phone'      => $respondentData['phone'] ?? null,
            ];

            if (empty($uniqueKeys['phone'])) {
                $uniqueKeys = [
                    'project_id' => $project->id,
                    'name'       => $respondentData['name'],
                ];
            }

            [$respondent, $respondentCreated] = $this->firstOrCreateRespondent(
                $uniqueKeys,
                array_merge($respondentData, [
                    'company_id' => $project->company_id,
                    'project_id' => $project->id,
                    'created_by' => $enumeratorId,
                ])
            );

            // 2. Submission — sekali saja per project + respondent
            $existingSubmission = Submission::where('project_id', $project->id)
                ->where('respondent_id', $respondent->id)
                ->first();

            if ($existingSubmission) {
                return [
                    'respondent' => $respondent,
                    'submission' => $existingSubmission,
                    'is_new'     => false,
                ];
            }

            /** @var UploadedFile $photo */
            $photo     = $submissionData['photo'];
            $photoPath = $photo->store('submissions', 'public');

            $submission = Submission::create([
                'company_id'       => $project->company_id,
                'project_id'       => $project->id,
                'assessment_type'  => $assessmentType,
                'respondent_id'    => $respondent->id,
                'enumerator_id'    => $enumeratorId,
                'status'           => 'submitted',
                'photo_path'       => $photoPath,
                'photo_mime'       => $photo->getClientMimeType(),
                'photo_size_bytes' => $photo->getSize(),
                'latitude'         => $submissionData['latitude'],
                'longitude'        => $submissionData['longitude'],
            ]);

            // 3. Submission template answers — bisa banyak
            $answerRecords = array_map(fn($ans) => [
                'submission_id' => $submission->id,
                'question_id'   => $ans['question_id'],
                'type'          => $ans['type'],
                'value'         => $ans['value'],
                'created_at'    => now(),
            ], $answers);

            SubmissionTemplateAnswer::insert($answerRecords);

            return [
                'respondent' => $respondent,
                'submission' => $submission,
                'is_new'     => true,
            ];
        });
    }

    private function firstOrCreateRespondent(array $uniqueKeys, array $allData): array
    {
        $respondent = Respondent::where(function ($q) use ($uniqueKeys) {
            foreach ($uniqueKeys as $col => $val) {
                $q->where($col, $val);
            }
        })->first();

        if ($respondent) {
            return [$respondent, false];
        }

        $respondent = Respondent::create($allData);
        return [$respondent, true];
    }
}
