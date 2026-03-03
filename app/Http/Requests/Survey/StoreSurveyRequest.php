<?php

namespace App\Http\Requests\Survey;

use Illuminate\Foundation\Http\FormRequest;

class StoreSurveyRequest extends FormRequest
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
            // Respondent data
            'respondent.name'              => ['required', 'string', 'max:150'],
            'respondent.phone'             => ['nullable', 'string', 'max:32'],
            'respondent.age'               => ['nullable', 'integer', 'min:1', 'max:120'],
            'respondent.gender'            => ['nullable', 'string', 'in:male,female'],
            'respondent.education_level'   => ['nullable', 'string', 'max:50'],
            'respondent.main_occupation'   => ['nullable', 'string', 'max:80'],
            'respondent.respondent_status' => ['nullable', 'string', 'max:30'],
            'respondent.monthly_income'    => ['nullable', 'integer', 'min:0'],
            'respondent.address'           => ['nullable', 'string'],

            // Submission data
            'submission.photo'             => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'submission.latitude'          => ['required', 'numeric', 'between:-90,90'],
            'submission.longitude'         => ['required', 'numeric', 'between:-180,180'],

            // Survey answers: array of { question_id: value }
            'answers'                      => ['required', 'array', 'min:1'],
            'answers.*.question_id'        => ['required', 'integer', 'exists:template_questions,id'],
            'answers.*.value'              => ['required', 'integer', 'between:1,5'],
        ];
    }

    public function messages(): array
    {
        return [
            'respondent.name.required'       => 'Nama responden wajib diisi.',
            'submission.photo.required'      => 'Foto bukti wajib diunggah.',
            'submission.photo.image'         => 'File foto harus berupa gambar.',
            'submission.photo.max'           => 'Ukuran foto maksimal 5MB.',
            'submission.latitude.required'   => 'Koordinat GPS (latitude) diperlukan.',
            'submission.longitude.required'  => 'Koordinat GPS (longitude) diperlukan.',
            'answers.required'               => 'Jawaban kuesioner wajib diisi.',
            'answers.*.value.between'        => 'Nilai jawaban harus antara 1 hingga 5.',
        ];
    }
}
