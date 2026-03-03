<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnumeratorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'email'          => $this->email,
            'phone'          => $this->phone,
            'isActive'       => $this->is_active,
            'companyId'      => $this->company_id,
            'submissions'    => $this->submissions_count ?? 0,
            'activeProjects' => $this->active_projects_count ?? 0,
            'createdAt'      => $this->created_at?->toISOString(),
        ];
    }
}
