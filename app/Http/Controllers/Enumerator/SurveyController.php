<?php

namespace App\Http\Controllers\Enumerator;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Services\SurveyService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SurveyController extends Controller
{   
    protected $surveyService; 

    public function __construct(SurveyService $surveyService)
    {
        $this->surveyService = $surveyService;
    }

    public function surveyRespondentPage($projectId, Request $request){
        $project = Project::findOrFail($projectId);
        $projectCode = $request->projectCode; 
        $surveyType = $request->surveyType;
        $isCodeTrue = $this->surveyService->checkProjectCode($projectCode, $projectId);

        if ($isCodeTrue == true) {
            return Inertia::render('Enumerator/Survey/RespondentSurvey', [
            'project' => $project,
            'surveyType' => $surveyType
        ]);
        } else { 
            return redirect()->back()->with('error', 'Kode yang dimasukkan salah');
        }
    }
}
