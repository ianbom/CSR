<?php

namespace App\Http\Requests\ProjectSroi;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectSroiSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'order_no' => ['sometimes', 'nullable', 'integer', 'min:1'],
        ];
    }
}
