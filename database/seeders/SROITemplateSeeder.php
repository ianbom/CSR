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
                    'description' => 'Template pertanyaan SROI untuk Program Bantuan DSA ASTRA. Pertanyaan dapat dicopy ke project dan dicustom oleh company.',
                    'is_active' => true,
                    'created_by' => $adminId,
                    'published_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );

            $sections = [
                [
                    'key' => 'pengetahuan_perusahaan',
                    'title' => 'I. Pengetahuan Perusahaan',
                    'description' => null,
                    'order_no' => 1,
                ],
                [
                    'key' => 'pengetahuan_program',
                    'title' => 'II. Pengetahuan Program',
                    'description' => null,
                    'order_no' => 2,
                ],
                [
                    'key' => 'pengetahuan_kelompok',
                    'title' => 'III. Pengetahuan Kelompok',
                    'description' => null,
                    'order_no' => 3,
                ],
                [
                    'key' => 'bidang_kewirausahaan',
                    'title' => 'Bidang Kewirausahaan',
                    'description' => 'Pertanyaan dampak sebelum dan setelah adanya program pada bidang kewirausahaan.',
                    'order_no' => 4,
                ],
                [
                    'key' => 'bidang_kesehatan',
                    'title' => 'Bidang Kesehatan',
                    'description' => 'Pertanyaan dampak sebelum dan setelah adanya program pada bidang kesehatan.',
                    'order_no' => 5,
                ],
                [
                    'key' => 'bidang_lingkungan',
                    'title' => 'Bidang Lingkungan',
                    'description' => 'Pertanyaan dampak sebelum dan setelah adanya program pada bidang lingkungan.',
                    'order_no' => 6,
                ],
                [
                    'key' => 'bidang_pendidikan',
                    'title' => 'Bidang Pendidikan',
                    'description' => 'Pertanyaan dampak sebelum dan setelah adanya program pada bidang pendidikan.',
                    'order_no' => 7,
                ],
                [
                    'key' => 'outcome_lain',
                    'title' => 'Outcome Lain',
                    'description' => 'Pertanyaan tambahan untuk outcome lain yang dirasakan penerima manfaat.',
                    'order_no' => 8,
                ],
            ];

            foreach ($sections as $section) {
                $this->sectionIds[$section['key']] = $this->upsertAndGetId(
                    'sroi_template_sections',
                    [
                        'template_id' => $templateId,
                        'title' => $section['title'],
                        'deleted_at' => null,
                    ],
                    [
                        'description' => $section['description'],
                        'order_no' => $section['order_no'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }

            foreach ($this->questions() as $question) {
                $sectionId = $this->sectionIds[$question['section']];

                $parentQuestionId = null;

                if (! empty($question['parent_code'])) {
                    $parentCode = $question['parent_code'];

                    if (! isset($this->questionIds[$parentCode])) {
                        throw new \RuntimeException("Parent question code {$parentCode} belum dibuat.");
                    }

                    $parentQuestionId = $this->questionIds[$parentCode];
                }

                $questionId = $this->upsertAndGetId(
                    'sroi_template_questions',
                    [
                        'template_id' => $templateId,
                        'code' => $question['code'],
                        'deleted_at' => null,
                    ],
                    [
                        'section_id' => $sectionId,
                        'parent_question_id' => $parentQuestionId,
                        'question_text' => $question['question_text'],
                        'help_text' => $question['help_text'] ?? null,
                        'answer_type' => $question['answer_type'] ?? null,
                        'unit' => $question['unit'] ?? null,
                        'is_required' => $question['is_required'] ?? false,
                        'is_group' => $question['is_group'] ?? false,
                        'is_calculated' => $question['is_calculated'] ?? false,
                        'order_no' => $question['order_no'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );

                $this->questionIds[$question['code']] = $questionId;
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

    private function questions(): array
    {
        return [
            /*
            |--------------------------------------------------------------------------
            | I. Pengetahuan Perusahaan
            |--------------------------------------------------------------------------
            */
            [
                'section' => 'pengetahuan_perusahaan',
                'code' => 'PP_001',
                'question_text' => 'Apakah Anda menggunakan produk ASTRA?',
                'answer_type' => 'text',
                'is_required' => true,
                'order_no' => 1,
            ],

            /*
            |--------------------------------------------------------------------------
            | II. Pengetahuan Program
            |--------------------------------------------------------------------------
            */
            [
                'section' => 'pengetahuan_program',
                'code' => 'PR_001',
                'question_text' => 'Apakah Anda mengetahui Program Bantuan DSA ASTRA?',
                'answer_type' => 'text',
                'is_required' => true,
                'order_no' => 1,
            ],
            [
                'section' => 'pengetahuan_program',
                'code' => 'PR_002',
                'question_text' => 'Sejauh mana keterlibatan dan peran Anda dalam Program Bantuan DSA ASTRA?',
                'answer_type' => 'text',
                'is_required' => true,
                'order_no' => 2,
            ],
            [
                'section' => 'pengetahuan_program',
                'code' => 'PR_003',
                'question_text' => 'Aktivitas apa saja yang Anda jalani dalam Program Bantuan DSA ASTRA?',
                'answer_type' => 'text',
                'is_required' => true,
                'order_no' => 3,
            ],
            [
                'section' => 'pengetahuan_program',
                'code' => 'PR_004',
                'question_text' => 'Dukungan atau bantuan apa saja yang diterima dalam Program Bantuan ASTRA?',
                'help_text' => 'Isi bantuan financial dan non financial. Contoh: Financial: bantuan modal. Non Financial: pelatihan, pendampingan, alat usaha.',
                'answer_type' => 'text',
                'is_required' => false,
                'order_no' => 4,
            ],

            /*
            |--------------------------------------------------------------------------
            | III. Pengetahuan Kelompok
            |--------------------------------------------------------------------------
            */
            [
                'section' => 'pengetahuan_kelompok',
                'code' => 'PK_001',
                'question_text' => 'Bagaimana latar belakang kelompok dapat berdiri hingga saat ini? Tahun berapa berdirinya?',
                'answer_type' => 'text',
                'is_required' => false,
                'order_no' => 1,
            ],
            [
                'section' => 'pengetahuan_kelompok',
                'code' => 'PK_002',
                'question_text' => 'Bagaimana struktur dalam kelompok? Anda berperan sebagai apa?',
                'answer_type' => 'text',
                'is_required' => false,
                'order_no' => 2,
            ],
            [
                'section' => 'pengetahuan_kelompok',
                'code' => 'PK_003',
                'question_text' => 'Apa saja produk yang dibuat dalam kelompok ini? Berapa kapasitas produksinya?',
                'answer_type' => 'text',
                'is_required' => false,
                'order_no' => 3,
            ],

            /*
            |--------------------------------------------------------------------------
            | Bidang Kewirausahaan
            |--------------------------------------------------------------------------
            */
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_IMPACT_GROUP',
                'question_text' => 'Seberapa besar dampak yang dirasakan oleh penerima manfaat sebelum dan setelah adanya program?',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_TOOL_BUDGET_GROUP',
                'parent_code' => 'KWU_IMPACT_GROUP',
                'question_text' => 'Penghematan Anggaran Alat Usaha',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_TOOL_BUDGET_BEFORE',
                'parent_code' => 'KWU_TOOL_BUDGET_GROUP',
                'question_text' => 'Besar jumlah yang harus dikeluarkan penerima manfaat sebelum adanya program',
                'help_text' => 'Isi nominal rupiah per bulan.',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'is_required' => false,
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_TOOL_BUDGET_AFTER',
                'parent_code' => 'KWU_TOOL_BUDGET_GROUP',
                'question_text' => 'Besar jumlah yang harus dikeluarkan penerima manfaat setelah adanya program',
                'help_text' => 'Isi nominal rupiah per bulan.',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'is_required' => false,
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_TOOL_BUDGET_SAVING',
                'parent_code' => 'KWU_TOOL_BUDGET_GROUP',
                'question_text' => 'Besar jumlah yang dihemat penerima manfaat setelah adanya program',
                'help_text' => 'Isi nominal rupiah per bulan. Dapat dihitung dari nilai sebelum dikurangi nilai setelah.',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'is_calculated' => true,
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_KNOWLEDGE_GROUP',
                'parent_code' => 'KWU_IMPACT_GROUP',
                'question_text' => 'Peningkatan Pengetahuan',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_TRAINING_RECEIVED',
                'parent_code' => 'KWU_KNOWLEDGE_GROUP',
                'question_text' => 'Pelatihan apa saja yang diterima? Sebutkan.',
                'answer_type' => 'text',
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_INCOME_GROUP',
                'parent_code' => 'KWU_IMPACT_GROUP',
                'question_text' => 'Peningkatan Pendapatan',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_INCOME_BEFORE',
                'parent_code' => 'KWU_INCOME_GROUP',
                'question_text' => 'Besar pendapatan penerima manfaat sebelum adanya program',
                'help_text' => 'Isi nominal rupiah per bulan.',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_INCOME_AFTER',
                'parent_code' => 'KWU_INCOME_GROUP',
                'question_text' => 'Besar pendapatan penerima manfaat setelah adanya program',
                'help_text' => 'Isi nominal rupiah per bulan.',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_INCOME_INCREASE',
                'parent_code' => 'KWU_INCOME_GROUP',
                'question_text' => 'Besar peningkatan pendapatan penerima manfaat setelah adanya program',
                'help_text' => 'Isi nominal rupiah per bulan. Dapat dihitung dari pendapatan setelah dikurangi pendapatan sebelum.',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'is_calculated' => true,
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_NEW_JOB_GROUP',
                'parent_code' => 'KWU_IMPACT_GROUP',
                'question_text' => 'Lapangan Pekerjaan Baru',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 4,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_NEW_JOB_DESCRIPTION',
                'parent_code' => 'KWU_NEW_JOB_GROUP',
                'question_text' => 'Apakah terdapat lapangan pekerjaan baru ketika adanya program? Jelaskan.',
                'answer_type' => 'text',
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_NEW_JOB_INCOME_BEFORE',
                'parent_code' => 'KWU_NEW_JOB_GROUP',
                'question_text' => 'Besar pendapatan sebelum adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_NEW_JOB_INCOME_AFTER',
                'parent_code' => 'KWU_NEW_JOB_GROUP',
                'question_text' => 'Besar pendapatan setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_OTHER_OUTCOME',
                'parent_code' => 'KWU_IMPACT_GROUP',
                'question_text' => 'Outcome lainnya pada bidang kewirausahaan',
                'answer_type' => 'text',
                'order_no' => 5,
            ],
            [
                'section' => 'bidang_kewirausahaan',
                'code' => 'KWU_OTHER_CONTRIBUTOR',
                'question_text' => 'Apakah ada pihak lain yang berkontribusi di bidang UMKM? Jika ada, sebutkan.',
                'help_text' => 'Isi Ada/Tidak ada, lalu sebutkan pihak yang berkontribusi jika ada.',
                'answer_type' => 'text',
                'order_no' => 2,
            ],

            /*
            |--------------------------------------------------------------------------
            | Bidang Kesehatan
            |--------------------------------------------------------------------------
            */
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_IMPACT_GROUP',
                'question_text' => 'Seberapa besar dampak yang dirasakan oleh penerima manfaat sebelum dan setelah adanya program?',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_INFRA_GROUP',
                'parent_code' => 'KES_IMPACT_GROUP',
                'question_text' => 'Penghematan Pengadaan Sarana Prasarana',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_INFRA_BEFORE',
                'parent_code' => 'KES_INFRA_GROUP',
                'question_text' => 'Besar jumlah yang harus dikeluarkan penerima manfaat sebelum adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_INFRA_AFTER',
                'parent_code' => 'KES_INFRA_GROUP',
                'question_text' => 'Besar jumlah yang harus dikeluarkan penerima manfaat setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_INFRA_SAVING',
                'parent_code' => 'KES_INFRA_GROUP',
                'question_text' => 'Besar jumlah yang dihemat penerima manfaat setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'is_calculated' => true,
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_VITAMIN_MEDICINE_GROUP',
                'parent_code' => 'KES_IMPACT_GROUP',
                'question_text' => 'Penghematan Anggaran Pengadaan Vitamin dan Obat-obatan',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_VITAMIN_MEDICINE_BEFORE',
                'parent_code' => 'KES_VITAMIN_MEDICINE_GROUP',
                'question_text' => 'Besar jumlah yang harus dikeluarkan penerima manfaat sebelum adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_VITAMIN_MEDICINE_AFTER',
                'parent_code' => 'KES_VITAMIN_MEDICINE_GROUP',
                'question_text' => 'Besar jumlah yang harus dikeluarkan penerima manfaat setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_VITAMIN_MEDICINE_SAVING',
                'parent_code' => 'KES_VITAMIN_MEDICINE_GROUP',
                'question_text' => 'Besar jumlah yang dihemat penerima manfaat setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'is_calculated' => true,
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_PMT_GROUP',
                'parent_code' => 'KES_IMPACT_GROUP',
                'question_text' => 'Penghematan Anggaran Pengadaan PMT',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_PMT_BEFORE',
                'parent_code' => 'KES_PMT_GROUP',
                'question_text' => 'Besar jumlah yang harus dikeluarkan penerima manfaat sebelum adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_PMT_AFTER',
                'parent_code' => 'KES_PMT_GROUP',
                'question_text' => 'Besar jumlah yang harus dikeluarkan penerima manfaat setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_PMT_SAVING',
                'parent_code' => 'KES_PMT_GROUP',
                'question_text' => 'Besar jumlah yang dihemat penerima manfaat setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'is_calculated' => true,
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_KNOWLEDGE_GROUP',
                'parent_code' => 'KES_IMPACT_GROUP',
                'question_text' => 'Peningkatan Pengetahuan',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 4,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_TRAINING_RECEIVED',
                'parent_code' => 'KES_KNOWLEDGE_GROUP',
                'question_text' => 'Pelatihan apa saja yang diterima? Sebutkan.',
                'answer_type' => 'text',
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_OTHER_OUTCOME',
                'parent_code' => 'KES_IMPACT_GROUP',
                'question_text' => 'Outcome lainnya pada bidang kesehatan',
                'answer_type' => 'text',
                'order_no' => 5,
            ],
            [
                'section' => 'bidang_kesehatan',
                'code' => 'KES_OTHER_CONTRIBUTOR',
                'question_text' => 'Apakah ada pihak lain yang berkontribusi di bidang Kesehatan? Jika ada, sebutkan.',
                'answer_type' => 'text',
                'order_no' => 2,
            ],

            /*
            |--------------------------------------------------------------------------
            | Bidang Lingkungan
            |--------------------------------------------------------------------------
            */
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_IMPACT_GROUP',
                'question_text' => 'Seberapa besar dampak yang dirasakan oleh penerima manfaat sebelum dan setelah adanya program?',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_INFRA_GROUP',
                'parent_code' => 'LING_IMPACT_GROUP',
                'question_text' => 'Penghematan Anggaran Sarana Prasarana',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_INFRA_BEFORE',
                'parent_code' => 'LING_INFRA_GROUP',
                'question_text' => 'Besar jumlah yang harus dikeluarkan penerima manfaat sebelum adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_INFRA_AFTER',
                'parent_code' => 'LING_INFRA_GROUP',
                'question_text' => 'Besar jumlah yang harus dikeluarkan penerima manfaat setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_INFRA_SAVING',
                'parent_code' => 'LING_INFRA_GROUP',
                'question_text' => 'Besar jumlah yang dihemat penerima manfaat setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'is_calculated' => true,
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_KNOWLEDGE_GROUP',
                'parent_code' => 'LING_IMPACT_GROUP',
                'question_text' => 'Peningkatan Pengetahuan',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_TRAINING_RECEIVED',
                'parent_code' => 'LING_KNOWLEDGE_GROUP',
                'question_text' => 'Pelatihan apa saja yang diterima? Sebutkan.',
                'answer_type' => 'text',
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_INCOME_GROUP',
                'parent_code' => 'LING_IMPACT_GROUP',
                'question_text' => 'Peningkatan Pendapatan',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_INCOME_BEFORE',
                'parent_code' => 'LING_INCOME_GROUP',
                'question_text' => 'Besar pendapatan penerima manfaat sebelum adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_INCOME_AFTER',
                'parent_code' => 'LING_INCOME_GROUP',
                'question_text' => 'Besar pendapatan penerima manfaat setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_INCOME_INCREASE',
                'parent_code' => 'LING_INCOME_GROUP',
                'question_text' => 'Besar peningkatan pendapatan penerima manfaat setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'is_calculated' => true,
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_NEW_JOB_GROUP',
                'parent_code' => 'LING_IMPACT_GROUP',
                'question_text' => 'Lapangan Pekerjaan Baru',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 4,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_NEW_JOB_DESCRIPTION',
                'parent_code' => 'LING_NEW_JOB_GROUP',
                'question_text' => 'Apakah terdapat lapangan pekerjaan baru ketika adanya program? Jelaskan.',
                'answer_type' => 'text',
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_NEW_JOB_INCOME_BEFORE',
                'parent_code' => 'LING_NEW_JOB_GROUP',
                'question_text' => 'Besar pendapatan sebelum adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_NEW_JOB_INCOME_AFTER',
                'parent_code' => 'LING_NEW_JOB_GROUP',
                'question_text' => 'Besar pendapatan setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_OTHER_OUTCOME',
                'parent_code' => 'LING_IMPACT_GROUP',
                'question_text' => 'Outcome lainnya pada bidang lingkungan',
                'answer_type' => 'text',
                'order_no' => 5,
            ],
            [
                'section' => 'bidang_lingkungan',
                'code' => 'LING_OTHER_CONTRIBUTOR',
                'question_text' => 'Apakah ada pihak lain yang berkontribusi di bidang Lingkungan? Jika ada, sebutkan.',
                'answer_type' => 'text',
                'order_no' => 2,
            ],

            /*
            |--------------------------------------------------------------------------
            | Bidang Pendidikan
            |--------------------------------------------------------------------------
            */
            [
                'section' => 'bidang_pendidikan',
                'code' => 'PEND_IMPACT_GROUP',
                'question_text' => 'Seberapa besar dampak yang dirasakan oleh penerima manfaat sebelum dan setelah adanya program?',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_pendidikan',
                'code' => 'PEND_INFRA_GROUP',
                'parent_code' => 'PEND_IMPACT_GROUP',
                'question_text' => 'Penghematan Anggaran Sarana Prasarana',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_pendidikan',
                'code' => 'PEND_INFRA_BEFORE',
                'parent_code' => 'PEND_INFRA_GROUP',
                'question_text' => 'Besar jumlah yang harus dikeluarkan penerima manfaat sebelum adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_pendidikan',
                'code' => 'PEND_INFRA_AFTER',
                'parent_code' => 'PEND_INFRA_GROUP',
                'question_text' => 'Besar jumlah yang harus dikeluarkan penerima manfaat setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_pendidikan',
                'code' => 'PEND_INFRA_SAVING',
                'parent_code' => 'PEND_INFRA_GROUP',
                'question_text' => 'Besar jumlah yang dihemat penerima manfaat setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'is_calculated' => true,
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_pendidikan',
                'code' => 'PEND_KNOWLEDGE_GROUP',
                'parent_code' => 'PEND_IMPACT_GROUP',
                'question_text' => 'Peningkatan Pengetahuan',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_pendidikan',
                'code' => 'PEND_TRAINING_RECEIVED',
                'parent_code' => 'PEND_KNOWLEDGE_GROUP',
                'question_text' => 'Pelatihan apa saja yang diterima? Sebutkan.',
                'answer_type' => 'text',
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_pendidikan',
                'code' => 'PEND_NEW_JOB_GROUP',
                'parent_code' => 'PEND_IMPACT_GROUP',
                'question_text' => 'Lapangan Pekerjaan Baru',
                'answer_type' => null,
                'is_group' => true,
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_pendidikan',
                'code' => 'PEND_NEW_JOB_DESCRIPTION',
                'parent_code' => 'PEND_NEW_JOB_GROUP',
                'question_text' => 'Apakah terdapat lapangan pekerjaan baru ketika adanya program? Jelaskan.',
                'answer_type' => 'text',
                'order_no' => 1,
            ],
            [
                'section' => 'bidang_pendidikan',
                'code' => 'PEND_NEW_JOB_INCOME_BEFORE',
                'parent_code' => 'PEND_NEW_JOB_GROUP',
                'question_text' => 'Besar pendapatan sebelum adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 2,
            ],
            [
                'section' => 'bidang_pendidikan',
                'code' => 'PEND_NEW_JOB_INCOME_AFTER',
                'parent_code' => 'PEND_NEW_JOB_GROUP',
                'question_text' => 'Besar pendapatan setelah adanya program',
                'answer_type' => 'number',
                'unit' => 'rupiah_per_bulan',
                'order_no' => 3,
            ],
            [
                'section' => 'bidang_pendidikan',
                'code' => 'PEND_OTHER_OUTCOME',
                'parent_code' => 'PEND_IMPACT_GROUP',
                'question_text' => 'Outcome lainnya pada bidang pendidikan',
                'answer_type' => 'text',
                'order_no' => 4,
            ],
            [
                'section' => 'bidang_pendidikan',
                'code' => 'PEND_OTHER_CONTRIBUTOR',
                'question_text' => 'Apakah ada pihak lain yang berkontribusi di bidang Pendidikan? Jika ada, sebutkan.',
                'answer_type' => 'text',
                'order_no' => 2,
            ],

            /*
            |--------------------------------------------------------------------------
            | Outcome Lain
            |--------------------------------------------------------------------------
            */
            [
                'section' => 'outcome_lain',
                'code' => 'OUTCOME_OTHER_DESCRIPTION',
                'question_text' => 'Outcome lain, jika ada sebutkan.',
                'answer_type' => 'text',
                'order_no' => 1,
            ],
            [
                'section' => 'outcome_lain',
                'code' => 'OUTCOME_PROKLIM_GIFT_SAVING',
                'question_text' => 'Penghematan biaya hadiah Proklim',
                'answer_type' => 'number',
                'unit' => 'rupiah',
                'order_no' => 2,
            ],
            [
                'section' => 'outcome_lain',
                'code' => 'OUTCOME_EXHIBITION_SAVING',
                'question_text' => 'Penghematan biaya pameran',
                'answer_type' => 'number',
                'unit' => 'rupiah',
                'order_no' => 3,
            ],
            [
                'section' => 'outcome_lain',
                'code' => 'OUTCOME_PACKAGING_DESIGN_SAVING',
                'question_text' => 'Penghematan biaya pembuatan desain kemasan',
                'answer_type' => 'number',
                'unit' => 'rupiah',
                'order_no' => 4,
            ],
            [
                'section' => 'outcome_lain',
                'code' => 'OUTCOME_PROGRAM_IMPORTANCE_SCORE',
                'question_text' => 'Seberapa penting adanya program DSA? Isi angka 1-10.',
                'answer_type' => 'number',
                'unit' => 'skala_1_10',
                'order_no' => 5,
            ],
            [
                'section' => 'outcome_lain',
                'code' => 'OUTCOME_PROGRAM_SATISFACTION_SCORE',
                'question_text' => 'Seberapa puas dengan adanya program DSA? Isi angka 1-10.',
                'answer_type' => 'number',
                'unit' => 'skala_1_10',
                'order_no' => 6,
            ],
        ];
    }
}
