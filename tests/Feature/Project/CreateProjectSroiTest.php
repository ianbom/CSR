<?php

use App\Models\City;
use App\Models\Company;
use App\Models\District;
use App\Models\Project;
use App\Models\Province;
use App\Models\User;

it('allows creating an sroi-only project without ikm or sloi targets', function () {
    $company = Company::create(['name' => 'CSR Company']);
    $user = User::factory()->create([
        'company_id' => $company->id,
        'role' => 'company',
    ]);
    $province = Province::create(['name' => 'Jawa Timur']);
    $city = City::create([
        'province_id' => $province->id,
        'name' => 'Surabaya',
        'type' => 'kota',
    ]);
    $district = District::create([
        'city_id' => $city->id,
        'name' => 'Wonokromo',
    ]);

    $response = $this->actingAs($user)->post(route('projects.store'), [
        'name' => 'SROI Project',
        'target_ikm_count' => 0,
        'target_sloi_count' => 0,
        'enable_ikm' => false,
        'enable_sloi' => false,
        'enable_sroi' => true,
        'district_ids' => [$district->id],
    ]);

    $response->assertRedirect();

    expect(Project::query()->where('name', 'SROI Project')->where('enable_sroi', true)->exists())->toBeTrue();
});
