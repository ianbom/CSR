<?php

namespace App\Http\Requests\TemplateQuestion;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTemplateQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $templateId = $this->route('templateId');
        $questionId = $this->route('questionId');

        return [
            'category'      => 'nullable|string|max:100',
            'code'          => 'required|string|max:50|unique:template_questions,code,' . $questionId . ',id,template_id,' . $templateId,
            'question_text' => 'required|string',
            'order_no'      => 'nullable|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'code.required'          => 'Kode pertanyaan wajib diisi.',
            'code.unique'            => 'Kode pertanyaan sudah digunakan di template ini.',
            'question_text.required' => 'Teks pertanyaan wajib diisi.',
        ];
    }
}
