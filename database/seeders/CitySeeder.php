<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sqlPath = public_path('wilayah.sql');

        if (!file_exists($sqlPath)) {
            $this->command->error('File wilayah.sql tidak ditemukan di folder public!');
            return;
        }

        $content = file_get_contents($sqlPath);

        // Extract cities INSERT statement
        if (preg_match('/INSERT INTO `cities`.*?VALUES\s*(.*?);/s', $content, $matches)) {
            $valuesString = $matches[1];

            // Parse each row
            preg_match_all('/\((\d+),\s*\'([^\']+)\',\s*\'([^\']+)\',\s*(\d+),\s*\'[^\']+\',\s*\'[^\']+\'\)/', $valuesString, $rows, PREG_SET_ORDER);

            $cities = [];
            foreach ($rows as $row) {
                $cities[] = [
                    'id' => (int) $row[1],
                    'code' => $row[2],
                    'name' => $row[3],
                    'province_id' => (int) $row[4],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Insert in chunks
            $chunks = array_chunk($cities, 100);
            foreach ($chunks as $chunk) {
                DB::table('cities')->insertOrIgnore($chunk);
            }

            $this->command->info('Berhasil import ' . count($cities) . ' data kota/kabupaten.');
        } else {
            $this->command->error('Tidak dapat menemukan data cities di file SQL!');
        }
    }
}
