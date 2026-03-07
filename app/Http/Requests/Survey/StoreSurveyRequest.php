<?php

namespace App\Http\Requests\Survey;

use Illuminate\Foundation\Http\FormRequest;

class StoreSurveyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Respondent data
            'respondent.name' => ['required', 'string', 'max:150'],
            'respondent.phone' => ['nullable', 'string', 'max:32'],
            'respondent.age' => ['nullable', 'integer', 'min:1', 'max:120'],
            'respondent.gender' => ['nullable', 'string', 'in:male,female'],
            'respondent.education_level' => ['nullable', 'string', 'max:50'],
            'respondent.main_occupation' => ['nullable', 'string', 'max:80'],
            'respondent.respondent_status' => ['nullable', 'string', 'max:30'],
            'respondent.monthly_income' => ['nullable', 'integer', 'min:0'],
            'respondent.address' => ['nullable', 'string'],

            // Submission data
            'submission.photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'submission.latitude' => ['required', 'numeric', 'between:-90,90'],
            'submission.longitude' => ['required', 'numeric', 'between:-180,180'],

            // Assessment type
            'assessment_type' => ['required', 'string', 'in:IKM,SLOI,SROI'],

            // Redirect intent
            'redirect_to' => ['nullable', 'string', 'in:final,continue'],

            // Survey answers: array of { question_id, type, value }
            'answers' => ['required', 'array', 'min:1'],
            'answers.*.question_id' => ['required', 'integer', 'exists:template_questions,id'],
            'answers.*.type' => ['required', 'string', 'in:ikm-kepentingan,ikm-kinerja,sloi'],
            'answers.*.value' => ['required', 'integer', 'min:1', 'max:5'],
        ];
    }

    public function messages(): array
    {
        return [
            'respondent.name.required' => 'Nama responden wajib diisi.',
            'submission.photo.required' => 'Foto bukti wajib diunggah.',
            'submission.photo.image' => 'File foto harus berupa gambar.',
            'submission.photo.max' => 'Ukuran foto maksimal 5MB.',
            'submission.latitude.required' => 'Koordinat GPS (latitude) diperlukan.',
            'submission.longitude.required' => 'Koordinat GPS (longitude) diperlukan.',
            'answers.required' => 'Jawaban kuesioner wajib diisi.',
            'answers.*.type.in' => 'Tipe jawaban tidak valid.',
            'answers.*.value.min' => 'Nilai jawaban minimal 1.',
            'answers.*.value.max' => 'Nilai jawaban maksimal 5.',
        ];
    }
}
