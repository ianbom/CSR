<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TemplateQuestionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'templateId'   => $this->template_id,
            'category'     => $this->category,
            'code'         => $this->code,
            'questionText' => $this->question_text,
            'orderNo'      => $this->order_no,
            'createdAt'    => $this->created_at?->toISOString(),
        ];
    }
}
