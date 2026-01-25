<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $provinces = [
            ['id' => 1, 'code' => '11', 'name' => 'Aceh'],
            ['id' => 2, 'code' => '51', 'name' => 'Bali'],
            ['id' => 3, 'code' => '36', 'name' => 'Banten'],
            ['id' => 4, 'code' => '17', 'name' => 'Bengkulu'],
            ['id' => 5, 'code' => '34', 'name' => 'Daerah Istimewa Yogyakarta'],
            ['id' => 6, 'code' => '31', 'name' => 'DKI Jakarta'],
            ['id' => 7, 'code' => '75', 'name' => 'Gorontalo'],
            ['id' => 8, 'code' => '15', 'name' => 'Jambi'],
            ['id' => 9, 'code' => '32', 'name' => 'Jawa Barat'],
            ['id' => 10, 'code' => '33', 'name' => 'Jawa Tengah'],
            ['id' => 11, 'code' => '35', 'name' => 'Jawa Timur'],
            ['id' => 12, 'code' => '61', 'name' => 'Kalimantan Barat'],
            ['id' => 13, 'code' => '63', 'name' => 'Kalimantan Selatan'],
            ['id' => 14, 'code' => '62', 'name' => 'Kalimantan Tengah'],
            ['id' => 15, 'code' => '64', 'name' => 'Kalimantan Timur'],
            ['id' => 16, 'code' => '65', 'name' => 'Kalimantan Utara'],
            ['id' => 17, 'code' => '19', 'name' => 'Kepulauan Bangka Belitung'],
            ['id' => 18, 'code' => '21', 'name' => 'Kepulauan Riau'],
            ['id' => 19, 'code' => '18', 'name' => 'Lampung'],
            ['id' => 20, 'code' => '81', 'name' => 'Maluku'],
            ['id' => 21, 'code' => '82', 'name' => 'Maluku Utara'],
            ['id' => 22, 'code' => '52', 'name' => 'Nusa Tenggara Barat'],
            ['id' => 23, 'code' => '53', 'name' => 'Nusa Tenggara Timur'],
            ['id' => 24, 'code' => '91', 'name' => 'Papua'],
            ['id' => 25, 'code' => '92', 'name' => 'Papua Barat'],
            ['id' => 26, 'code' => '96', 'name' => 'Papua Barat Daya'],
            ['id' => 27, 'code' => '95', 'name' => 'Papua Pegunungan'],
            ['id' => 28, 'code' => '93', 'name' => 'Papua Selatan'],
            ['id' => 29, 'code' => '94', 'name' => 'Papua Tengah'],
            ['id' => 30, 'code' => '14', 'name' => 'Riau'],
            ['id' => 31, 'code' => '76', 'name' => 'Sulawesi Barat'],
            ['id' => 32, 'code' => '73', 'name' => 'Sulawesi Selatan'],
            ['id' => 33, 'code' => '72', 'name' => 'Sulawesi Tengah'],
            ['id' => 34, 'code' => '74', 'name' => 'Sulawesi Tenggara'],
            ['id' => 35, 'code' => '71', 'name' => 'Sulawesi Utara'],
            ['id' => 36, 'code' => '13', 'name' => 'Sumatera Barat'],
            ['id' => 37, 'code' => '16', 'name' => 'Sumatera Selatan'],
            ['id' => 38, 'code' => '12', 'name' => 'Sumatera Utara'],
        ];

        foreach ($provinces as $province) {
            DB::table('provinces')->updateOrInsert(
                ['id' => $province['id']],
                array_merge($province, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}
