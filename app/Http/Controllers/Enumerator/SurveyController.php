<?php

namespace App\Http\Controllers\Enumerator;

use App\Http\Controllers\Controller;
use App\Http\Requests\Survey\StoreSurveyRequest;
use App\Models\Project;
use App\Services\SurveyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SurveyController extends Controller
{
    protected $surveyService;

    public function __construct(SurveyService $surveyService)
    {
        $this->surveyService = $surveyService;
    }

    public function surveyRespondentPage($projectId, Request $request)
    {
        $project = Project::findOrFail($projectId);
        $projectCode = $request->projectCode;
        $surveyType = $request->surveyType;
        $isCodeTrue = $this->surveyService->checkProjectCode($projectCode, $projectId);

        if ($isCodeTrue == true) {
            // Load questions berdasarkan surveyType (IKM / SLOI)
            $questions = $this->surveyService->getQuestionsBySurveyType($project, $surveyType);

            return Inertia::render('Enumerator/Survey/RespondentSurvey', [
                'project' => $project,
                'surveyType' => $surveyType,
                'questions' => $questions,
            ]);
        } else {
            return redirect()->back()->with('error', 'Kode yang dimasukkan salah');
        }
    }

    public function storeDataSurvey(StoreSurveyRequest $request, $projectId)
    {
        $project = Project::findOrFail($projectId);
        $enumeratorId = Auth::id();

        $result = $this->surveyService->storeSurvey(
            $request->validated(),
            $project,
            $enumeratorId
        );

        // Jika data sudah pernah disubmit sebelumnya
        // if (!$result['is_new']) {
        //     return back()->with('error', 'Data survei untuk responden ini sudah pernah dikirim sebelumnya.');
        // }

        if ($request->input('redirect_to') === 'continue') {
            return redirect()
                ->route('enumerator.survey.respondent', [
                    'projectId' => $projectId,
                    'projectCode' => $project->project_code,
                    'surveyType' => $request->input('assessment_type'),
                ])
                ->with('success', 'Survei berhasil disimpan. Silakan isi data responden berikutnya.');
        }

        return redirect()
            ->route('enumerator.list-survey')
            ->with('success', 'Survei berhasil disimpan.');
    }
}
