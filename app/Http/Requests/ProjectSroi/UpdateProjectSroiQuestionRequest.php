<?php

namespace App\Http\Requests\ProjectSroi;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectSroiQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'section_id' => ['sometimes', 'required', 'integer', 'exists:project_sroi_sections,id'],
            'parent_question_id' => ['sometimes', 'nullable', 'integer', 'exists:project_sroi_questions,id'],
            'question_text' => ['sometimes', 'required', 'string'],
            'help_text' => ['sometimes', 'nullable', 'string'],
            'answer_type' => ['sometimes', 'nullable', 'string', 'in:text,number'],
            'unit' => ['sometimes', 'nullable', 'string', 'max:50'],
            'is_group' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'order_no' => ['sometimes', 'nullable', 'integer', 'min:1'],
        ];
    }
}
