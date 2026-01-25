<?php

namespace App\Services;

use App\Models\Province;
use App\Models\City;
use App\Models\District;

class AreaService
{
    /**
     * Get all provinces.
     */
    public function getAllProvinces()
    {
        return Province::orderBy('name')->get(['id', 'code', 'name']);
    }

    /**
     * Get cities by province ID.
     */
    public function getCitiesByProvince(int $provinceId)
    {
        return City::where('province_id', $provinceId)
            ->orderBy('name')
            ->get(['id', 'code', 'name', 'province_id']);
    }

    /**
     * Get districts by city ID.
     */
    public function getDistrictsByCity(int $cityId)
    {
        return District::where('city_id', $cityId)
            ->orderBy('name')
            ->get(['id', 'code', 'name', 'city_id']);
    }

    /**
     * Get district with full location info.
     */
    public function getDistrictWithLocation(int $districtId)
    {
        return District::with(['city.province'])
            ->find($districtId);
    }
}
