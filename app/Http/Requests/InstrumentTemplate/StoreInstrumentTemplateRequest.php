<?php

namespace App\Http\Requests\InstrumentTemplate;

use Illuminate\Foundation\Http\FormRequest;

class StoreInstrumentTemplateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'string', 'in:IKM,SLOI'],
            'name' => ['required', 'string', 'max:150'],
            'version' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string'],
        ];
    }
}
