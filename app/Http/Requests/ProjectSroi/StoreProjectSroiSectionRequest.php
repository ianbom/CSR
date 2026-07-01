<?php

namespace App\Http\Requests\ProjectSroi;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectSroiSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'order_no' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
