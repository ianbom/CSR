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
                'question_text' => 'Menurut Bapak/Ibu seberapa penting kesesuaian bantuan program dengan kebutuhan dari penerima manfaat pada {project} sebelum kegiatan dilaksanakan?',
                'order_no' => 1,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-2',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting kemudahan prosedur pada pengajuan untuk mendapatkan bantuan pada {project} sebelum kegiatan dilaksanakan?',
                'order_no' => 2,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-3',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting adanya kegiatan sosialisasi {project} sebelum kegiatan dilaksanakan?',
                'order_no' => 3,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-4',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting adanya kegiatan {project} yang dilakukan kepada masyarakat?',
                'order_no' => 4,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-5',
                'question_text' => 'Menurut Bapak/Ibu seberapa pentingkah pelibatan pemerintah setempat (desa/kecamatan) dan tokoh masyarakat (agama/ pemuda/perempuan) untuk merencanakan {project}?',
                'order_no' => 5,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-6',
                'question_text' => 'Menurut Bapak/Ibu seberapa pentingkah masyarakat mengetahui kejelasan sistem /mekanisme /prosedur pelaksanaan {project}?',
                'order_no' => 6,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-7',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting kejelasan jenis dan detail {project}?',
                'order_no' => 7,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-8',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting ketepatan jadwal pelaksanaan {project}?',
                'order_no' => 8,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-9',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting adanya kejelasan/keterbukaan informasi tentang anggaran atau pembiayaan {project} ?',
                'order_no' => 9,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-10',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting kesesuaian antara perencanaan program dengan pelaksanaan {project}?',
                'order_no' => 10,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-11',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting adanya pendamping / trainer yang kompeten dalam pelaksanaan {project}?',
                'order_no' => 11,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-12',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting perilaku pendamping / trainer terkait dengan pelaksanaan {project}?',
                'order_no' => 12,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-13',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting adanya sistem penanganan aduan, saran dan kritik dalam pelaksanaan {project}?',
                'order_no' => 13,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-14',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting adanya dukungan sarana dan prasarana dalam pelaksanaan {project} ?',
                'order_no' => 14,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-15',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting adanya pemantauan dan evaluasi pelaksanaan {project} secara berkala?',
                'order_no' => 15,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-16',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting Masyarakat mengetahui besaran dampak yang dihasilkan dari {project} ?',
                'order_no' => 16,
            ],
            [
                'category' => 'ikm-kepentingan',
                'code' => 'IKM-17',
                'question_text' => 'Menurut Bapak/Ibu seberapa penting keberlanjutan manfaat dari {project}?',
                'order_no' => 17,
            ],
            
            // IKM Kinerja
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-1',
                'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap kinerja kegiatan sosialisasi {project} yang telah dilakukan perusahaan kepada masyarakat?',
                'order_no' => 18,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-2',
                'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap adanya kegiatan {project} yang dilakukan oleh perusahaan kepada masyarakat?',
                'order_no' => 19,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-3',
                'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap keterlibatan pemerintah setempat (desa/kecamatan) dan tokoh masyarakat (agama/pemuda/perempuan) dalam proses perencanaan {project}?',
                'order_no' => 20,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-4',
                'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap kejelasan mekanisme/ prosedur pelaksanaan {project} selama ini?',
                'order_no' => 21,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-5',
                'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap kejelasan jenis dan detail {project} selama ini?',
                'order_no' => 22,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-6',
                'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap ketepatan jadwal pelaksanaan {project} selama ini?',
                'order_no' => 23,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-7',
                'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap kejelasan & keterbukaan informasi tentang anggaran {project} selama ini?',
                'order_no' => 24,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-8',
                'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap kesesuaian antara perencanaan program dengan pelaksanaan {project} sejauh ini?',
                'order_no' => 25,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-9',
                'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap kinerja pendampingan yang sesuai dengan kompetensi dalam pelaksanaan {project} selama ini?',
                'order_no' => 26,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-10',
                'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap kinerja proses perilaku pendamping terkait degan pelaksanaan {project} sejauh ini?',
                'order_no' => 27,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-11',
                'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap besar dampak yang dihasilkan {project} untuk masyarakat sejauh ini ?',
                'order_no' => 28,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-12',
                'question_text' => 'Bagaimana tingkat kepuasan Bapak/Ibu terhadap keberlanjutan dampak dari {project} sejauh ini?',
                'order_no' => 29,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-13',
                'question_text' => 'Menurut Bapak/Ibu seberapa puas adanya sistem penanganan aduan, saran dan kritik dalam pelaksanaan {project}?',
                'order_no' => 30,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-14',
                'question_text' => 'Menurut Bapak/Ibu seberapa puas adanya dukungan sarana dan prasarana dalam pelaksanaan {project}?',
                'order_no' => 31,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-15',
                'question_text' => 'Menurut Bapak/Ibu seberapa puas adanya pemantauan dan evaluasi pelaksanaan {project} secara berkala?',
                'order_no' => 32,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-16',
                'question_text' => 'Menurut Bapak/Ibu seberapa puas Masyarakat mengetahui besaran dampak yang dihasilkan dari {project}?',
                'order_no' => 33,
            ],
            [
                'category' => 'ikm-kinerja',
                'code' => 'IKM-17',
                'question_text' => 'Menurut Bapak/Ibu seberapa puas keberlanjutan manfaat dari {project}?',
                'order_no' => 34,
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
                'category' => 'sloi',
                'code' => 'SLOI-S1',
                'question_text' => '{perusahaan} membagikan informasi tentang hal-hal yang memengaruhi kita (Melakukan Sosialisasi dan Komunikasi)',
                'order_no' => 1,
            ],
            [
                'category' => 'sloi',
                'code' => 'SLOI-S2',
                'question_text' => '{perusahaan} berkontribusi pada kesejahteraan daerah (khususnya kepada masyarakat, desa, kec, kab, dan provinsi)',
                'order_no' => 2,
            ],
            [
                'category' => 'sloi',
                'code' => 'SLOI-S3',
                'question_text' => '{perusahaan} memperhitungkan (memperhatikan) kepentingan kita',
                'order_no' => 3,
            ],
            [
                'category' => 'sloi',
                'code' => 'SLOI-S4',
                'question_text' => '{perusahaan} menghormati cara kita melakukan sesuatu (aktivitas dan budaya)',
                'order_no' => 4,
            ],
            [
                'category' => 'sloi',
                'code' => 'SLOI-S5',
                'question_text' => 'Anda puas dengan hubungan anda dengan {perusahaan}',
                'order_no' => 5,
            ],
            [
                'category' => 'sloi',
                'code' => 'SLOI-S6',
                'question_text' => 'Anda memiliki visi yang sama untuk masa depan dengan {perusahaan}',
                'order_no' => 6,
            ],
            [
                'category' => 'sloi',
                'code' => 'SLOI-S7',
                'question_text' => '{perusahaan} memperlakukan semua orang dengan adil',
                'order_no' => 7,
            ],
            [
                'category' => 'sloi',
                'code' => 'SLOI-S8',
                'question_text' => 'Kita bisa mendapatkan manfaat dari hubungan dengan {perusahaan} / keberadaan {perusahaan}',
                'order_no' => 8,
            ],
            [
                'category' => 'sloi',
                'code' => 'SLOI-S9',
                'question_text' => '{perusahaan} Mendengarkan anda / Pemangku kepentingan lainnya',
                'order_no' => 9,
            ],
            [
                'category' => 'sloi',
                'code' => 'SLOI-S10',
                'question_text' => 'kehadiran {perusahaan} adalah keuntungan / memberikan manfaat',
                'order_no' => 10,
            ],
            [
                'category' => 'sloi',
                'code' => 'SLOI-S11',
                'question_text' => '{perusahaan} memberikan lebih banyak bantuan kepada mereka yang lebih terpengaruh / terdampak',
                'order_no' => 11,
            ],
            [
                'category' => 'sloi',
                'code' => 'SLOI-S12',
                'question_text' => '{perusahaan} berbagi/berdiskusi dalam hal pengambilan keputusan tentang hal-hal yang mempengaruhi anda/ berdampak pada anda',
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
