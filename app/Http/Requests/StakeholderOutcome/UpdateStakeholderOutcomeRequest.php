<?php

namespace App\Http\Requests\StakeholderOutcome;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStakeholderOutcomeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'outcome' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }
}
