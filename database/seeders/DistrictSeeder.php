<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DistrictSeeder extends Seeder
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

        // Extract districts INSERT statement
        if (preg_match('/INSERT INTO `districts`.*?VALUES\s*(.*?);/s', $content, $matches)) {
            $valuesString = $matches[1];

            // Parse each row
            preg_match_all('/\((\d+),\s*\'([^\']+)\',\s*\'([^\']+)\',\s*(\d+),\s*\'[^\']+\',\s*\'[^\']+\'\)/', $valuesString, $rows, PREG_SET_ORDER);

            $districts = [];
            foreach ($rows as $row) {
                $districts[] = [
                    'id' => (int) $row[1],
                    'code' => $row[2],
                    'name' => $row[3],
                    'city_id' => (int) $row[4],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Insert in chunks
            $chunks = array_chunk($districts, 500);
            foreach ($chunks as $chunk) {
                DB::table('districts')->insertOrIgnore($chunk);
            }

            $this->command->info('Berhasil import ' . count($districts) . ' data kecamatan.');
        } else {
            $this->command->error('Tidak dapat menemukan data districts di file SQL!');
        }
    }
}
