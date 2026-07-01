<?php

namespace App\Http\Requests\ProjectSroi;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectSroiFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'description' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'required', 'string', 'in:draft,active,archived'],
        ];
    }
}
