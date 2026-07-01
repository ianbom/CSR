<?php

namespace App\Http\Requests\ProjectSroi;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CopyProjectSroiFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'template_id' => [
                'required',
                'integer',
                Rule::exists('sroi_templates', 'id')->where('is_active', true)->whereNull('deleted_at'),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'template_id.required' => 'Template SROI wajib dipilih.',
            'template_id.exists' => 'Template SROI tidak aktif atau tidak ditemukan.',
        ];
    }
}
