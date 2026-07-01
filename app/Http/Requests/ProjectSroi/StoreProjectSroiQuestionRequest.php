<?php

namespace App\Http\Requests\ProjectSroi;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectSroiQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'section_id' => ['required', 'integer', 'exists:project_sroi_sections,id'],
            'parent_question_id' => ['nullable', 'integer', 'exists:project_sroi_questions,id'],
            'code' => ['nullable', 'string', 'max:80'],
            'question_text' => ['required', 'string'],
            'help_text' => ['nullable', 'string'],
            'answer_type' => ['nullable', 'string', 'in:text,number'],
            'unit' => ['nullable', 'string', 'max:50'],
            'is_required' => ['boolean'],
            'is_group' => ['boolean'],
            'is_calculated' => ['boolean'],
            'is_active' => ['boolean'],
            'order_no' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
