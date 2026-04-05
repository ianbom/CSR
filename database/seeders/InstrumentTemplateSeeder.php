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
            // IKM Kepentingan
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-1',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting kesesuaian bantuan program dengan kebutuhan dari penerima manfaat pada Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong sebelum kegiatan dilaksanakan?',
                'order_no' => 1,
            ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-2',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa penting kemudahan prosedur pada pengajuan untuk mendapatkan bantuan pada Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong sebelum kegiatan dilaksanakan?',
            //     'order_no' => 2,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-3',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa penting adanya kegiatan sosialisasi Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong sebelum kegiatan dilaksanakan?',
            //     'order_no' => 3,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-4',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa penting adanya kegiatan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong yang dilakukan kepada masyarakat?',
            //     'order_no' => 4,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-5',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa pentingkah pelibatan pemerintah setempat (desa/kecamatan) dan tokoh masyarakat (agama/ pemuda/perempuan) untuk merencanakan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong?',
            //     'order_no' => 5,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-6',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa pentingkah masyarakat mengetahui kejelasan sistem /mekanisme /prosedur pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong?',
            //     'order_no' => 6,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-7',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa penting kejelasan jenis dan detail Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong?',
            //     'order_no' => 7,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-8',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa penting ketepatan jadwal pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong?',
            //     'order_no' => 8,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-9',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa penting adanya kejelasan/keterbukaan informasi tentang anggaran atau pembiayaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong ?',
            //     'order_no' => 9,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-10',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa penting kesesuaian antara perencanaan program dengan pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong?',
            //     'order_no' => 10,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-11',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa penting adanya pendamping / trainer yang kompeten dalam pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong?',
            //     'order_no' => 11,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-12',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa penting perilaku pendamping / trainer terkait dengan pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong?',
            //     'order_no' => 12,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-13',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa penting adanya sistem penanganan aduan, saran dan kritik dalam pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong?',
            //     'order_no' => 13,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-14',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa penting adanya dukungan sarana dan prasarana dalam pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong ?',
            //     'order_no' => 14,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-15',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa penting adanya pemantauan dan evaluasi pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong secara berkala?',
            //     'order_no' => 15,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-16',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa penting Masyarakat mengetahui besaran dampak yang dihasilkan dari Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong ?',
            //     'order_no' => 16,
            // ],
            // [
            //     'category' => 'ikm-kepentingan',
            //     'code' => 'IKM-KEP-17',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa penting keberlanjutan manfaat dari Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong?',
            //     'order_no' => 17,
            // ],
            
            // IKM Kinerja
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-1',
                'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap kinerja kegiatan sosialisasi Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong yang telah dilakukan perusahaan kepada masyarakat?',
                'order_no' => 18,
            ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-2',
            //     'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap adanya kegiatan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong yang dilakukan oleh perusahaan kepada masyarakat?',
            //     'order_no' => 19,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-3',
            //     'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap keterlibatan pemerintah setempat (desa/kecamatan) dan tokoh masyarakat (agama/pemuda/perempuan) dalam proses perencanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong?',
            //     'order_no' => 20,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-4',
            //     'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap kejelasan mekanisme/ prosedur pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong selama ini?',
            //     'order_no' => 21,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-5',
            //     'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap kejelasan jenis dan detail Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong selama ini?',
            //     'order_no' => 22,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-6',
            //     'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap ketepatan jadwal pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong selama ini?',
            //     'order_no' => 23,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-7',
            //     'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap kejelasan & keterbukaan informasi tentang anggaran Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong selama ini?',
            //     'order_no' => 24,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-8',
            //     'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap kesesuaian antara perencanaan program dengan pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong sejauh ini?',
            //     'order_no' => 25,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-9',
            //     'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap kinerja pendampingan yang sesuai dengan kompetensi dalam pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong selama ini?',
            //     'order_no' => 26,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-10',
            //     'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap kinerja proses perilaku pendamping terkait degan pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong sejauh ini?',
            //     'order_no' => 27,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-11',
            //     'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap besar dampak yang dihasilkan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong untuk masyarakat sejauh ini ?',
            //     'order_no' => 28,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-12',
            //     'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap keberlanjutan dampak dari Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong sejauh ini?',
            //     'order_no' => 29,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-13',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa puas adanya sistem penanganan aduan, saran dan kritik dalam pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong?',
            //     'order_no' => 30,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-14',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa puas adanya dukungan sarana dan prasarana dalam pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong?',
            //     'order_no' => 31,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-15',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa puas adanya pemantauan dan evaluasi pelaksanaan Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong secara berkala?',
            //     'order_no' => 32,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-16',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa puas Masyarakat mengetahui besaran dampak yang dihasilkan dari Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong?',
            //     'order_no' => 33,
            // ],
            // [
            //     'category' => 'ikm-kinerja',
            //     'code' => 'IKM-KIN-17',
            //     'question_text' => 'Menurut Bapak/Ibu seberapa puas keberlanjutan manfaat dari Program Pendampingan Kelompok Pengolah Kedelai Teluk Lamong?',
            //     'order_no' => 34,
            // ],
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
