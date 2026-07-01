<?php

namespace App\Http\Requests\ProjectStakeholder;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectStakeholderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }
}
