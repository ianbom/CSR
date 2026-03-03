<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstrumentTemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'type'           => $this->type,
            'name'           => $this->name,
            'version'        => $this->version,
            'description'    => $this->description,
            'isActive'       => $this->is_active,
            'publishedAt'    => $this->published_at?->toISOString(),
            'createdBy'      => $this->creator?->name,
            'questionsCount' => $this->questions_count ?? 0,
            'createdAt'      => $this->created_at?->toISOString(),
        ];
    }
}
