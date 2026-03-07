<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'company' && $this->user()?->company_id !== null;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'legal_name' => ['nullable', 'string', 'max:200'],
            'email' => ['nullable', 'string', 'email', 'max:191'],
            'phone' => ['nullable', 'string', 'max:32'],
            'address' => ['nullable', 'string'],
        ];
    }
}
