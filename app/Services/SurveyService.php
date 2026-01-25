<?php

namespace App\Services;

use App\Models\Project;

class SurveyService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function checkProjectCode($projectCode, $projectId){
        $project = Project::findOrFail($projectId);
        if ($project->project_code == $projectCode) {
            return true;
        }
        return false;
    }
}
