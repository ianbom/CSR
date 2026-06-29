<?php

namespace App\Http\Resources\Survey;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HistorySurveyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'assessmentType' => $this->assessment_type,
            'status' => $this->status,
            'submittedAt' => $this->submitted_at?->format('Y-m-d H:i'),
            'submissionNumber' => (int) $this->submission_number,
            'photoPath' => $this->photo_path,
            'latitude' => (float) $this->latitude,
            'longitude' => (float) $this->longitude,
            'project' => [
                'id' => $this->project->id,
                'name' => $this->project->name,
            ],
            'respondent' => $this->respondent ? [
                'name' => $this->respondent->name,
                'phone' => $this->respondent->phone,
                'address' => $this->respondent->address,
                'gender' => $this->respondent->gender,
                'age' => $this->respondent->age,
            ] : null,
        ];
    }
}
