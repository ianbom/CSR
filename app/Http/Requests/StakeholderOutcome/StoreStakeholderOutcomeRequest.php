<?php

namespace App\Http\Requests\StakeholderOutcome;

use Illuminate\Foundation\Http\FormRequest;

class StoreStakeholderOutcomeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'stakeholder_id' => ['required', 'integer', 'exists:project_stakeholders,id'],
            'outcome' => ['required', 'string', 'max:255'],
        ];
    }
}
