<?php

namespace Database\Seeders;

use App\Models\InstrumentTemplate;
use App\Models\TemplateQuestion;
use Illuminate\Database\Seeder;

class InstrumentTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create IKM Template
        $ikmTemplate = InstrumentTemplate::create([
            'type' => 'IKM',
            'name' => 'Indeks Kepuasan Masyarakat (IKM)',
            'version' => 1,
            'description' => 'Template standar untuk mengukur tingkat kepuasan masyarakat terhadap program CSR perusahaan.',
            'is_active' => true,
            'published_at' => now(),
        ]);

        $ikmQuestions = [
            [
                'category' => 'Persyaratan',
                'code' => 'IKM-U1',
                'question_text' => 'Persyaratan pelayanan yang harus dipenuhi mudah dipahami dan tidak memberatkan.',
                'order_no' => 1,
            ],
            [
                'category' => 'Prosedur',
                'code' => 'IKM-U2',
                'question_text' => 'Prosedur pelayanan jelas, mudah diikuti, dan tidak berbelit-belit.',
                'order_no' => 2,
            ],
            [
                'category' => 'Waktu Pelayanan',
                'code' => 'IKM-U3',
                'question_text' => 'Pelayanan diselesaikan sesuai waktu yang dijanjikan.',
                'order_no' => 3,
            ],
            [
                'category' => 'Biaya/Tarif',
                'code' => 'IKM-U4',
                'question_text' => 'Biaya/tarif pelayanan jelas, transparan, dan sesuai ketentuan.',
                'order_no' => 4,
            ],
            [
                'category' => 'Produk Layanan',
                'code' => 'IKM-U5',
                'question_text' => 'Hasil pelayanan yang diterima sesuai kebutuhan dan sesuai standar.',
                'order_no' => 5,
            ],
            [
                'category' => 'Kompetensi Pelaksana',
                'code' => 'IKM-U6',
                'question_text' => 'Petugas pelayanan kompeten, memahami tugasnya, dan mampu membantu dengan baik.',
                'order_no' => 6,
            ],
            [
                'category' => 'Perilaku Pelaksana',
                'code' => 'IKM-U7',
                'question_text' => 'Petugas pelayanan sopan, ramah, dan melayani dengan baik.',
                'order_no' => 7,
            ],
            [
                'category' => 'Penanganan Pengaduan',
                'code' => 'IKM-U8',
                'question_text' => 'Pengaduan/saran mudah disampaikan dan ditindaklanjuti dengan jelas.',
                'order_no' => 8,
            ],
            [
                'category' => 'Sarana dan Prasarana',
                'code' => 'IKM-U9',
                'question_text' => 'Sarana dan prasarana pelayanan memadai, bersih, dan nyaman digunakan.',
                'order_no' => 9,
            ],
        ];

        foreach ($ikmQuestions as $question) {
            TemplateQuestion::create([
                'template_id' => $ikmTemplate->id,
                ...$question,
            ]);
        }

        // Create SLOI Template
        $sloiTemplate = InstrumentTemplate::create([
            'type' => 'SLOI',
            'name' => 'Social Local Impact (SLOI)',
            'version' => 1,
            'description' => 'Template standar untuk mengukur dampak sosial program CSR terhadap masyarakat lokal.',
            'is_active' => true,
            'published_at' => now(),
        ]);

        $sloiQuestions = [
            [
                'category' => 'Komunikasi',
                'code' => 'SLOI-S1',
                'question_text' => 'Perusahaan membagikan informasi tentang hal-hal yang memengaruhi kita (melakukan sosialisasi dan komunikasi).',
                'order_no' => 1,
            ],
            [
                'category' => 'Kontribusi',
                'code' => 'SLOI-S2',
                'question_text' => 'Perusahaan berkontribusi pada kesejahteraan daerah (khususnya kepada masyarakat, desa, kec, kab, dan provinsi).',
                'order_no' => 2,
            ],
            [
                'category' => 'Kepentingan',
                'code' => 'SLOI-S3',
                'question_text' => 'Perusahaan memperhitungkan (memperhatikan) kepentingan kita.',
                'order_no' => 3,
            ],
            [
                'category' => 'Budaya',
                'code' => 'SLOI-S4',
                'question_text' => 'Perusahaan menghormati cara kita melakukan sesuatu (aktivitas dan budaya).',
                'order_no' => 4,
            ],
            [
                'category' => 'Kepuasan',
                'code' => 'SLOI-S5',
                'question_text' => 'Anda puas dengan hubungan anda dengan perusahaan.',
                'order_no' => 5,
            ],
            [
                'category' => 'Visi',
                'code' => 'SLOI-S6',
                'question_text' => 'Anda memiliki visi yang sama untuk masa depan dengan perusahaan.',
                'order_no' => 6,
            ],
            [
                'category' => 'Keadilan',
                'code' => 'SLOI-S7',
                'question_text' => 'Perusahaan memperlakukan semua orang dengan adil.',
                'order_no' => 7,
            ],
            [
                'category' => 'Manfaat',
                'code' => 'SLOI-S8',
                'question_text' => 'Kita bisa mendapatkan manfaat dari hubungan dengan perusahaan / keberadaan perusahaan.',
                'order_no' => 8,
            ],
            [
                'category' => 'Partisipasi',
                'code' => 'SLOI-S9',
                'question_text' => 'Perusahaan mendengarkan anda / pemangku kepentingan lainnya.',
                'order_no' => 9,
            ],
            [
                'category' => 'Keuntungan',
                'code' => 'SLOI-S10',
                'question_text' => 'Kehadiran perusahaan adalah keuntungan / memberikan manfaat.',
                'order_no' => 10,
            ],
            [
                'category' => 'Bantuan',
                'code' => 'SLOI-S11',
                'question_text' => 'Perusahaan memberikan lebih banyak bantuan kepada mereka yang lebih terpengaruh / terdampak.',
                'order_no' => 11,
            ],
            [
                'category' => 'Pengambilan Keputusan',
                'code' => 'SLOI-S12',
                'question_text' => 'Perusahaan berbagi/berdiskusi dalam pengambilan keputusan tentang hal-hal yang mempengaruhi anda/berdampak pada anda.',
                'order_no' => 12,
            ],
        ];

        foreach ($sloiQuestions as $question) {
            TemplateQuestion::create([
                'template_id' => $sloiTemplate->id,
                ...$question,
            ]);
        }
    }
}
