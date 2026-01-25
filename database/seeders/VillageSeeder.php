<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VillageSeeder extends Seeder
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

        // Disable foreign key checks for faster insert
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $handle = fopen($sqlPath, 'r');
        if (!$handle) {
            $this->command->error('Tidak dapat membuka file wilayah.sql!');
            return;
        }

        $inVillagesSection = false;
        $villages = [];
        $totalInserted = 0;
        $batchSize = 1000;

        while (($line = fgets($handle)) !== false) {
            // Check if we're entering the villages section
            if (strpos($line, 'INSERT INTO `villages`') !== false) {
                $inVillagesSection = true;
                continue;
            }

            // If we're in the villages section, parse the data
            if ($inVillagesSection) {
                // Check if we've reached the end of the villages INSERT statement
                if (strpos($line, 'INSERT INTO') !== false && strpos($line, 'villages') === false) {
                    break;
                }

                // Parse each row
                preg_match_all('/\((\d+),\s*\'([^\']+)\',\s*\'([^\']*)\',\s*(\d+),\s*\'[^\']+\',\s*\'[^\']+\'\)/', $line, $matches, PREG_SET_ORDER);

                foreach ($matches as $match) {
                    $villages[] = [
                        'id' => (int) $match[1],
                        'code' => $match[2],
                        'name' => $match[3],
                        'district_id' => (int) $match[4],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    // Insert in batches
                    if (count($villages) >= $batchSize) {
                        DB::table('villages')->insertOrIgnore($villages);
                        $totalInserted += count($villages);
                        $villages = [];

                        // Show progress
                        if ($totalInserted % 10000 === 0) {
                            $this->command->info("Progress: {$totalInserted} data desa telah di-import...");
                        }
                    }
                }
            }
        }

        // Insert remaining data
        if (!empty($villages)) {
            DB::table('villages')->insertOrIgnore($villages);
            $totalInserted += count($villages);
        }

        fclose($handle);

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info("Berhasil import {$totalInserted} data desa/kelurahan.");
    }
}
