<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Companies
        $companyA = Company::create([
            'name' => 'PT Maju Bersama',
            'legal_name' => 'PT Maju Bersama Sejahtera',
            'email' => 'info@majubersama.co.id',
            'phone' => '021-12345678',
            'address' => 'Jl. Sudirman No. 123, Jakarta Pusat',
            'status' => 'active',
        ]);

        $companyB = Company::create([
            'name' => 'PT Sentosa Abadi',
            'legal_name' => 'PT Sentosa Abadi Makmur',
            'email' => 'contact@sentosaabadi.co.id',
            'phone' => '031-87654321',
            'address' => 'Jl. Pemuda No. 456, Surabaya',
            'status' => 'active',
        ]);

        // Create Superadmin (no company)
        User::create([
            'company_id' => null,
            'name' => 'Super Admin',
            'email' => 'superadmin@csr.test',
            'password' => Hash::make('password'),
            'role' => 'superadmin',
            'phone' => '081234567890',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create Admin (no company)
        User::create([
            'company_id' => null,
            'name' => 'Platform Admin',
            'email' => 'admin@csr.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '081234567891',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create Company Admin for Company A
        User::create([
            'company_id' => $companyA->id,
            'name' => 'Admin Maju Bersama',
            'email' => 'admin@majubersama.co.id',
            'password' => Hash::make('password'),
            'role' => 'company',
            'phone' => '081345678901',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create Company Staff for Company A
        User::create([
            'company_id' => $companyA->id,
            'name' => 'Staff Maju Bersama',
            'email' => 'staff@majubersama.co.id',
            'password' => Hash::make('password'),
            'role' => 'company',
            'phone' => '081456789012',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create Enumerators for Company A
        User::create([
            'company_id' => $companyA->id,
            'name' => 'Enumerator 1 Maju',
            'email' => 'enum1@majubersama.co.id',
            'password' => Hash::make('password'),
            'role' => 'enumerator',
            'phone' => '081567890123',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        User::create([
            'company_id' => $companyA->id,
            'name' => 'Enumerator 2 Maju',
            'email' => 'enum2@majubersama.co.id',
            'password' => Hash::make('password'),
            'role' => 'enumerator',
            'phone' => '081678901234',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create Company Admin for Company B
        User::create([
            'company_id' => $companyB->id,
            'name' => 'Admin Sentosa Abadi',
            'email' => 'admin@sentosaabadi.co.id',
            'password' => Hash::make('password'),
            'role' => 'company',
            'phone' => '082345678901',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create Company Staff for Company B
        User::create([
            'company_id' => $companyB->id,
            'name' => 'Staff Sentosa Abadi',
            'email' => 'staff@sentosaabadi.co.id',
            'password' => Hash::make('password'),
            'role' => 'company',
            'phone' => '082456789012',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create Enumerators for Company B
        User::create([
            'company_id' => $companyB->id,
            'name' => 'Enumerator 1 Sentosa',
            'email' => 'enum1@sentosaabadi.co.id',
            'password' => Hash::make('password'),
            'role' => 'enumerator',
            'phone' => '082567890123',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        User::create([
            'company_id' => $companyB->id,
            'name' => 'Enumerator 2 Sentosa',
            'email' => 'enum2@sentosaabadi.co.id',
            'password' => Hash::make('password'),
            'role' => 'enumerator',
            'phone' => '082678901234',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
    }
}
