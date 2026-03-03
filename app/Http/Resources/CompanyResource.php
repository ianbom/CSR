<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'legal_name'   => $this->legal_name,
            'email'        => $this->email,
            'phone'        => $this->phone,
            'address'      => $this->address,
            'status'       => $this->status,
            'usersCount'   => $this->users_count ?? 0,
            'projectsCount'=> $this->projects_count ?? 0,
            'createdAt'    => $this->created_at?->toISOString(),
        ];
    }
}
