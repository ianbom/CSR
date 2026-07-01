<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SroiTemplateSeeder extends Seeder
{
    private array $sectionIds = [];

    private array $questionIds = [];

    public function run(): void
    {
        DB::transaction(function () {
            $now = now();

            $this->sectionIds = [];
            $this->questionIds = [];

            $adminId = DB::table('users')
                ->whereIn('role', ['superadmin', 'admin'])
                ->orderBy('id')
                ->value('id');

            $templateId = $this->upsertAndGetId(
                'sroi_templates',
                [
                    'name' => 'Template SROI Program Bantuan DSA ASTRA',
                    'version' => 1,
                    'deleted_at' => null,
                ],
                [
                    'description' => 'Template pertanyaan SROI berdasarkan Kuesioner In Depth Interview SROI ASTRA. Pertanyaan dapat dicopy ke project dan dicustom oleh company.',
                    'is_active' => true,
                    'created_by' => $adminId,
                    'published_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );

            $sections = [
                ['key' => 'pengetahuan_perusahaan', 'title' => 'I. Pengetahuan Perusahaan', 'description' => null, 'order_no' => 1],
                ['key' => 'pengetahuan_program', 'title' => 'II. Pengetahuan Program', 'description' => null, 'order_no' => 2],
                ['key' => 'pengetahuan_kelompok', 'title' => 'III. Pengetahuan Kelompok', 'description' => null, 'order_no' => 3],
                ['key' => 'bidang_kewirausahaan', 'title' => 'BIDANG KEWIRAUSAHAAN', 'order_no' => 4],
                ['key' => 'bidang_kesehatan', 'title' => 'BIDANG KESEHATAN', 'description' => null, 'order_no' => 5],
                ['key' => 'bidang_lingkungan', 'title' => 'BIDANG LINGKUNGAN', 'description' => null, 'order_no' => 6],
                ['key' => 'bidang_pendidikan', 'title' => 'BIDANG PENDIDIKAN', 'description' => null, 'order_no' => 7],
                ['key' => 'outcome_lain', 'title' => 'Outcome Lain', 'description' => null, 'order_no' => 8],
            ];

            foreach ($sections as $section) {
                $this->sectionIds[$section['key']] = $this->upsertAndGetId(
                    'sroi_template_sections',
                    [
                        'template_id' => $templateId,
                        'order_no' => $section['order_no'],
                        'deleted_at' => null,
                    ],
                    [
                        'template_id' => $templateId,
                        'title' => $section['title'],
                        // 'description' => $section['description'],
                        'order_no' => $section['order_no'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }

            foreach ($this->questions() as $question) {
                $sectionId = $this->sectionIds[$question['section']];
                $parentQuestionId = null;

                if (! empty($question['parent_key'])) {
                    $parentKey = $question['parent_key'];

                    if (! isset($this->questionIds[$parentKey])) {
                        throw new \RuntimeException("Parent question key {$parentKey} belum dibuat.");
                    }

                    $parentQuestionId = $this->questionIds[$parentKey];
                }

                $questionId = $this->upsertAndGetId(
                    'sroi_template_questions',
                    [
                        'template_id' => $templateId,
                        'section_id' => $sectionId,
                        'parent_question_id' => $parentQuestionId,
                        'order_no' => $question['order_no'],
                        'deleted_at' => null,
                    ],
                    [
                        'template_id' => $templateId,
                        'section_id' => $sectionId,
                        'parent_question_id' => $parentQuestionId,
                        'question_text' => $question['question_text'],
                        'help_text' => $question['help_text'] ?? null,
                        'answer_type' => $question['answer_type'] ?? null,
                        'unit' => $question['unit'] ?? null,
                        'is_group' => $question['is_group'] ?? false,
                        'order_no' => $question['order_no'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );

                $this->questionIds[$question['key']] = $questionId;
            }

            Log::info('SROI template seeded successfully.', [
                'template_id' => $templateId,
            ]);
        });
    }

    private function upsertAndGetId(string $table, array $where, array $values): int
    {
        DB::table($table)->updateOrInsert($where, $values);

        return (int) DB::table($table)
            ->where($where)
            ->value('id');
    }

    private function group(string $section, string $key, string $questionText, int $orderNo, ?string $parentKey = null, ?string $helpText = null): array
    {
        return [
            'section' => $section,
            'key' => $key,
            'parent_key' => $parentKey,
            'question_text' => $questionText,
            'help_text' => $helpText,
            'answer_type' => null,
            'is_group' => true,
            'order_no' => $orderNo,
        ];
    }

    private function text(string $section, string $key, string $questionText, int $orderNo, ?string $parentKey = null, ?string $helpText = null): array
    {
        return [
            'section' => $section,
            'key' => $key,
            'parent_key' => $parentKey,
            'question_text' => $questionText,
            'help_text' => $helpText,
            'answer_type' => 'text',
            'is_group' => false,
            'order_no' => $orderNo,
        ];
    }

    private function number(string $section, string $key, string $questionText, int $orderNo, ?string $parentKey = null, string $unit = 'per_bulan', ?string $helpText = '(Rp ………………. / bulan)'): array
    {
        return [
            'section' => $section,
            'key' => $key,
            'parent_key' => $parentKey,
            'question_text' => $questionText,
            'help_text' => $helpText,
            'answer_type' => 'number',
            'unit' => $unit,
            'is_group' => false,
            'order_no' => $orderNo,
        ];
    }

    private function costSavingQuestions(string $section, string $prefix, string $parentKey): array
    {
        return [
            $this->number($section, "{$prefix}_BEFORE", 'Besar jumlah yang harus dikeluarkan penerima manfaat sebelum adanya program', 1, $parentKey),
            $this->number($section, "{$prefix}_AFTER", 'Besar jumlah yang harus dikeluarkan penerima manfaat setelah adanya program', 2, $parentKey),
            $this->number($section, "{$prefix}_SAVING", 'Besar jumlah yang dihemat penerima manfaat setelah adanya program', 3, $parentKey),
        ];
    }

    private function jobIncomeQuestions(string $section, string $prefix, string $parentKey): array
    {
        return [
            $this->number($section, "{$prefix}_INCOME_BEFORE", 'Besar pendapatan sebelum adanya program', 1, $parentKey),
            $this->number($section, "{$prefix}_INCOME_AFTER", 'Besar pendapatan setelah adanya program', 2, $parentKey),
        ];
    }

    private function questions(): array
    {
        return array_merge(
            [
                $this->text('pengetahuan_perusahaan', 'PP_001', 'Apakah Anda menggunakan produk ASTRA?', 1),
                $this->text('pengetahuan_program', 'PR_001', 'Apakah Anda mengetahui Program Bantuan DSA ASTRA?', 1),
                $this->text('pengetahuan_program', 'PR_002', 'Sejauh mana keterlibatan dan peran anda dalam Program Bantuan DSA ASTRA?', 2),
                $this->text('pengetahuan_program', 'PR_003', 'Aktivitas apa saja yang Anda jalani dalam Program Bantuan DSA ASTRA?', 3),
                $this->text('pengetahuan_program', 'PR_004', 'Dukungan atau bantuan apa saja yang diterima dalam Program Bantuan ASTRA (financial dan non financial)?', 4, null,),
                $this->text('pengetahuan_kelompok', 'PK_001', 'Bagaimana latar belakang kelompok dapat berdiri hingga saat ini? Tahun berapa berdirinya?', 1),
                $this->text('pengetahuan_kelompok', 'PK_002', 'Bagaimana struktur dalam kelompok? Anda berperan sebagai apa?', 2),
                $this->text('pengetahuan_kelompok', 'PK_003', 'Apa saja produk yang dibuat dalam kelompok ini? Berapa kapasitas produksinya?', 3),

                $this->group('bidang_kewirausahaan', 'KWU_ROOT', 'Seberapa besar dampak yang dirasakan oleh penerima manfaat sebelum dan setelah adanya program?', 1),
                $this->group('bidang_kewirausahaan', 'KWU_TOOLS', 'Penghematan Anggaran Alat Usaha', 2, 'KWU_ROOT'),
            ],
            $this->costSavingQuestions('bidang_kewirausahaan', 'KWU_TOOLS', 'KWU_TOOLS'),
            [
                $this->group('bidang_kewirausahaan', 'KWU_KNOWLEDGE', 'Peningkatan Pengetahuan', 6, 'KWU_ROOT'),
                $this->text('bidang_kewirausahaan', 'KWU_TRAINING', 'Pelatihan apa saja? Sebutkan:', 7, 'KWU_KNOWLEDGE'),
                $this->group('bidang_kewirausahaan', 'KWU_INCOME', 'Peningkatan Pendapatan', 8, 'KWU_ROOT'),
            ],
            $this->costSavingQuestions('bidang_kewirausahaan', 'KWU_INCOME', 'KWU_INCOME'),
            [
                $this->group('bidang_kewirausahaan', 'KWU_JOB', 'Apakah terdapat lapangan pekerjaan baru ketika adanya program?', 12, 'KWU_ROOT'),
            ],
            $this->jobIncomeQuestions('bidang_kewirausahaan', 'KWU_JOB', 'KWU_JOB'),
            [
                $this->text('bidang_kewirausahaan', 'KWU_OTHER', 'Outcome Lainnya', 15, 'KWU_ROOT'),
                $this->text('bidang_kewirausahaan', 'KWU_CONTRIBUTOR', 'Apakah ada pihak lain yang berkontribusi di bidang UMKM?', 16, null, '1. Ada
Sebutkan :

2. Tidak ada'),

                $this->group('bidang_kesehatan', 'KES_ROOT', 'Seberapa besar dampak yang dirasakan oleh penerima manfaat sebelum dan setelah adanya program?', 1),
                $this->group('bidang_kesehatan', 'KES_INFRA', 'Penghematan Pengadaan Sarana Prasarana', 2, 'KES_ROOT'),
            ],
            $this->costSavingQuestions('bidang_kesehatan', 'KES_INFRA', 'KES_INFRA'),
            [
                $this->group('bidang_kesehatan', 'KES_VITAMIN', 'Penghematan Anggaran Pengadaan Vitamin dan Obat-obatan', 6, 'KES_ROOT'),
            ],
            $this->costSavingQuestions('bidang_kesehatan', 'KES_VITAMIN', 'KES_VITAMIN'),
            [
                $this->group('bidang_kesehatan', 'KES_PMT', 'Penghematan Anggaran Pengadaan PMT', 10, 'KES_ROOT'),
            ],
            $this->costSavingQuestions('bidang_kesehatan', 'KES_PMT', 'KES_PMT'),
            [
                $this->group('bidang_kesehatan', 'KES_KNOWLEDGE', 'Peningkatan Pengetahuan', 14, 'KES_ROOT'),
                $this->text('bidang_kesehatan', 'KES_TRAINING', 'Pelatihan apa saja? Sebutkan:', 15, 'KES_KNOWLEDGE'),
                $this->text('bidang_kesehatan', 'KES_OTHER', 'Outcome Lainnya', 16, 'KES_ROOT'),
                $this->text('bidang_kesehatan', 'KES_CONTRIBUTOR', 'Apakah ada pihak lain yang berkontribusi di bidang Kesehatan?', 17, null, '1. Ada
Sebutkan :

2. Tidak ada'),

                $this->group('bidang_lingkungan', 'LING_ROOT', 'Seberapa besar dampak yang dirasakan oleh penerima manfaat sebelum dan setelah adanya program?', 1),
                $this->group('bidang_lingkungan', 'LING_INFRA', 'Penghematan Anggaran Sarana Prasarana', 2, 'LING_ROOT'),
            ],
            $this->costSavingQuestions('bidang_lingkungan', 'LING_INFRA', 'LING_INFRA'),
            [
                $this->group('bidang_lingkungan', 'LING_KNOWLEDGE', 'Peningkatan Pengetahuan', 6, 'LING_ROOT'),
                $this->text('bidang_lingkungan', 'LING_TRAINING', 'Pelatihan apa saja? Sebutkan:', 7, 'LING_KNOWLEDGE'),
                $this->group('bidang_lingkungan', 'LING_INCOME', 'Peningkatan Pendapatan', 8, 'LING_ROOT'),
            ],
            $this->costSavingQuestions('bidang_lingkungan', 'LING_INCOME', 'LING_INCOME'),
            [
                $this->group('bidang_lingkungan', 'LING_JOB', 'Apakah terdapat lapangan pekerjaan baru ketika adanya program?', 12, 'LING_ROOT'),
            ],
            $this->jobIncomeQuestions('bidang_lingkungan', 'LING_JOB', 'LING_JOB'),
            [
                $this->text('bidang_lingkungan', 'LING_OTHER', 'Outcome Lainnya', 15, 'LING_ROOT'),
                $this->text('bidang_lingkungan', 'LING_CONTRIBUTOR', 'Apakah ada pihak lain yang berkontribusi di bidang Lingkungan?', 16, null, '1. Ada
Sebutkan :

2. Tidak ada'),

                $this->group('bidang_pendidikan', 'PEND_ROOT', 'Seberapa besar dampak yang dirasakan oleh penerima manfaat sebelum dan setelah adanya program?', 1),
                $this->group('bidang_pendidikan', 'PEND_INFRA', 'Penghematan Anggaran Sarana Prasarana', 2, 'PEND_ROOT'),
            ],
            $this->costSavingQuestions('bidang_pendidikan', 'PEND_INFRA', 'PEND_INFRA'),
            [
                $this->group('bidang_pendidikan', 'PEND_KNOWLEDGE', 'Peningkatan Pengetahuan', 6, 'PEND_ROOT'),
                $this->text('bidang_pendidikan', 'PEND_TRAINING', 'Pelatihan apa saja? Sebutkan:', 7, 'PEND_KNOWLEDGE'),
                $this->group('bidang_pendidikan', 'PEND_JOB', 'Apakah terdapat lapangan pekerjaan baru ketika adanya program?', 8, 'PEND_ROOT'),
            ],
            $this->jobIncomeQuestions('bidang_pendidikan', 'PEND_JOB', 'PEND_JOB'),
            [
                $this->text('bidang_pendidikan', 'PEND_OTHER', 'Outcome Lainnya', 11, 'PEND_ROOT'),
                $this->text('bidang_pendidikan', 'PEND_CONTRIBUTOR', 'Apakah ada pihak lain yang berkontribusi di bidang Pendidikan?', 12, null, '1. Ada
Sebutkan :

2. Tidak ada'),

                $this->text('outcome_lain', 'OUTCOME_OTHER_DESCRIPTION', 'Outcome Lain (jika ada sebutkan)', 1),
                $this->text('outcome_lain', 'OUTCOME_PROKLIM_GIFT_SAVING', 'Penghematan biaya Hadiah Proklim', 2),
                $this->text('outcome_lain', 'OUTCOME_EXHIBITION_SAVING', 'Penghematan biaya pameran', 3),
                $this->text('outcome_lain', 'OUTCOME_PACKAGING_DESIGN_SAVING', 'Penghematan biaya pembuatan Desain kemasan', 4),
                $this->number('outcome_lain', 'OUTCOME_PROGRAM_IMPORTANCE_SCORE', 'Seberapa penting adanya program DSA 1-10', 5, null, 'skala_1_10', null),
                $this->number('outcome_lain', 'OUTCOME_PROGRAM_SATISFACTION_SCORE', 'Seberapa puas dengan adanya program DSA', 6, null, 'skala_1_10', null),
            ]
        );
    }
}
