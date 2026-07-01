<?php

namespace App\Http\Requests\Survey;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateSurveyRequest extends FormRequest
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
            'respondent.stakeholder_id' => ['nullable', 'integer', 'exists:project_stakeholders,id'],
            'respondent.phone' => ['nullable', 'string', 'max:32'],
            'respondent.age' => ['nullable', 'integer', 'min:1', 'max:120'],
            'respondent.gender' => ['nullable', 'string', 'in:male,female'],
            'respondent.education_level' => ['nullable', 'string', 'max:50'],
            'respondent.main_occupation' => ['nullable', 'string', 'max:80'],
            'respondent.respondent_status' => ['nullable', 'string', 'max:30'],
            'respondent.monthly_income' => ['nullable', 'integer', 'min:0'],
            'respondent.address' => ['nullable', 'string'],

            // Submission - photo is optional on edit (keep existing if not replaced)
            'submission.photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'submission.latitude' => ['required', 'numeric', 'between:-90,90'],
            'submission.longitude' => ['required', 'numeric', 'between:-180,180'],

            // Assessment type
            'assessment_type' => ['required', 'string', 'in:IKM,SLOI,SROI'],

            // Survey answers
            'answers' => ['nullable', 'array', 'min:1'],
            'answers.*.question_id' => ['required_with:answers', 'integer', 'exists:template_questions,id'],
            'answers.*.type' => ['required_with:answers', 'string', 'in:ikm-kepentingan,ikm-kinerja,sloi'],
            'answers.*.value' => ['required_with:answers', 'integer', 'min:1', 'max:6'],

            // Descriptive answers (optional, array of { question_id, answer })
            'descriptive_answers' => ['nullable', 'array'],
            'descriptive_answers.*.question_id' => ['required', 'integer', 'exists:project_descriptive_questions,id'],
            'descriptive_answers.*.answer' => ['required', 'string', 'max:2000'],

            // SROI answers
            'sroi_answers' => ['nullable', 'array'],
            'sroi_answers.*.project_sroi_question_id' => ['required', 'integer', 'exists:project_sroi_questions,id'],
            'sroi_answers.*.value_text' => ['nullable', 'string'],
            'sroi_answers.*.value_number' => ['nullable', 'numeric'],
        ];
    }

    public function messages(): array
    {
        return [
            'respondent.name.required' => 'Nama responden wajib diisi.',
            'submission.photo.image' => 'File foto harus berupa gambar.',
            'submission.photo.max' => 'Ukuran foto maksimal 5MB.',
            'submission.latitude.required' => 'Koordinat GPS (latitude) diperlukan.',
            'submission.longitude.required' => 'Koordinat GPS (longitude) diperlukan.',
            'answers.required' => 'Jawaban kuesioner wajib diisi.',
            'answers.*.type.in' => 'Tipe jawaban tidak valid.',
            'answers.*.value.min' => 'Nilai jawaban minimal 1.',
            'answers.*.value.max' => 'Nilai jawaban maksimal 6.',
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $answers = $this->input('answers', []);
                $assessmentType = strtoupper((string) $this->input('assessment_type'));

                if ($assessmentType !== 'SROI' && empty($answers)) {
                    $validator->errors()->add('answers', 'Jawaban kuesioner wajib diisi.');
                }

                if ($assessmentType === 'SROI' && empty($this->input('sroi_answers', []))) {
                    $validator->errors()->add('sroi_answers', 'Jawaban SROI wajib diisi.');
                }

                if ($assessmentType === 'SROI' && blank($this->input('respondent.stakeholder_id'))) {
                    $validator->errors()->add(
                        'respondent.stakeholder_id',
                        'Stakeholder wajib dipilih untuk survei SROI.',
                    );
                }

                foreach ($answers as $index => $answer) {
                    $type = $answer['type'] ?? null;
                    $value = (int) ($answer['value'] ?? 0);

                    if (in_array($type, ['ikm-kepentingan', 'ikm-kinerja']) && $value > 4) {
                        $validator->errors()->add(
                            "answers.{$index}.value",
                            'Nilai jawaban IKM maksimal 4.',
                        );
                    }

                    if ($type === 'sloi' && $value > 6) {
                        $validator->errors()->add(
                            "answers.{$index}.value",
                            'Nilai jawaban SLOI maksimal 6.',
                        );
                    }
                }

                $sroiAnswers = $this->input('sroi_answers', []);
                foreach ($sroiAnswers as $index => $answer) {
                    $valueText = trim((string) ($answer['value_text'] ?? ''));
                    $valueNumber = $answer['value_number'] ?? null;

                    if ($valueText === '' && $valueNumber === null) {
                        $validator->errors()->add(
                            "sroi_answers.{$index}",
                            'Jawaban SROI wajib diisi.',
                        );
                    }
                }
            },
        ];
    }
}
