<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Submission;
use App\Models\TemplateQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExcelController extends Controller
{
      public function exportRespondents(Request $request, int $id): StreamedResponse
    {
        $user = Auth::user();
        $type = $request->input('type', 'IKM');

        $project = Project::where('id', $id)
            ->where('company_id', $user->company_id)
            ->firstOrFail();

        $templateId = $type === 'IKM' ? $project->ikm_template_id : $project->sloi_template_id;

        $questions = [];
        if ($templateId) {
            $questions = TemplateQuestion::where('template_id', $templateId)
                ->orderBy('order_no')
                ->get();
        }

        $submissions = Submission::where('project_id', $id)
            ->where('assessment_type', $type)
            ->with(['respondent', 'enumerator', 'templateAnswers.question'])
            ->orderByDesc('submitted_at')
            ->get();

        $isIkm = $type === 'IKM';
        $filename = "respondent_{$type}_{$project->project_code}_" . now()->format('Ymd_His') . '.csv';

        return response()->streamDownload(function () use ($submissions, $questions, $isIkm) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // Build header
            $header = [
                'No',
                'Submission ID',
                'Tanggal Submit',
                'Status',
                'Enumerator',
                'Nama Responden',
                'Alamat',
                'Telepon',
                'Usia',
                'Jenis Kelamin',
                'Status Responden',
                'Pendidikan',
                'Pekerjaan',
                'Pendapatan Bulanan',
                'Latitude',
                'Longitude',
            ];

            foreach ($questions as $q) {
                if ($isIkm) {
                    $header[] = "{$q->code} - Kepentingan";
                    $header[] = "{$q->code} - Kinerja";
                } else {
                    $header[] = "{$q->code} - Nilai";
                }
            }

            if ($isIkm) {
                $header[] = 'Rata-rata Kepentingan';
                $header[] = 'Rata-rata Kinerja';
            }
            $header[] = 'Rata-rata Skor';

            fputcsv($handle, $header);

            // Build rows
            $no = 1;
            foreach ($submissions as $sub) {
                $respondent = $sub->respondent;

                // Build answer map
                $answers = [];
                $totalScore = 0;
                $answerCount = 0;
                $kepScore = 0;
                $kepCount = 0;
                $kinScore = 0;
                $kinCount = 0;

                foreach ($sub->templateAnswers as $answer) {
                    $code = $answer->question?->code ?? 'Q' . $answer->question_id;
                    $answerType = $answer->type ?? 'sloi';

                    if (! isset($answers[$code])) {
                        $answers[$code] = ['kepentingan' => null, 'kinerja' => null];
                    }

                    if ($answerType === 'ikm-kepentingan') {
                        $answers[$code]['kepentingan'] = $answer->value;
                        $kepScore += $answer->value ?? 0;
                        $kepCount++;
                    } elseif ($answerType === 'ikm-kinerja') {
                        $answers[$code]['kinerja'] = $answer->value;
                        $kinScore += $answer->value ?? 0;
                        $kinCount++;
                    } else {
                        $answers[$code]['kepentingan'] = $answer->value;
                        $answers[$code]['kinerja'] = $answer->value;
                    }

                    $totalScore += $answer->value ?? 0;
                    $answerCount++;
                }

                $row = [
                    $no++,
                    $sub->id,
                    $sub->submitted_at?->format('Y-m-d H:i'),
                    $sub->status,
                    $sub->enumerator?->name ?? '-',
                    $respondent?->name ?? '-',
                    $respondent?->address ?? '-',
                    $respondent?->phone ?? '-',
                    $respondent?->age ?? '-',
                    $respondent?->gender ?? '-',
                    $respondent?->respondent_status ?? '-',
                    $respondent?->education_level ?? '-',
                    $respondent?->main_occupation ?? '-',
                    $respondent?->monthly_income ?? '-',
                    $sub->latitude,
                    $sub->longitude,
                ];

                foreach ($questions as $q) {
                    $a = $answers[$q->code] ?? ['kepentingan' => null, 'kinerja' => null];
                    if ($isIkm) {
                        $row[] = $a['kepentingan'] ?? '-';
                        $row[] = $a['kinerja'] ?? '-';
                    } else {
                        $row[] = $a['kepentingan'] ?? '-';
                    }
                }

                if ($isIkm) {
                    $row[] = $kepCount > 0 ? round($kepScore / $kepCount, 2) : '-';
                    $row[] = $kinCount > 0 ? round($kinScore / $kinCount, 2) : '-';
                }
                $row[] = $answerCount > 0 ? round($totalScore / $answerCount, 2) : '-';

                fputcsv($handle, $row);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
