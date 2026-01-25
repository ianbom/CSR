<?php

namespace App\Http\Controllers;

use App\Services\AreaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AreaController extends Controller
{
    protected AreaService $areaService;

    public function __construct(AreaService $areaService)
    {
        $this->areaService = $areaService;
    }

    /**
     * Get all provinces.
     */
    public function getProvinces(): JsonResponse
    {
        $provinces = $this->areaService->getAllProvinces();
        return response()->json($provinces);
    }

    /**
     * Get cities by province.
     */
    public function getCities(Request $request): JsonResponse
    {
        $request->validate([
            'province_id' => 'required|integer|exists:provinces,id'
        ]);

        $cities = $this->areaService->getCitiesByProvince($request->province_id);
        return response()->json($cities);
    }

    /**
     * Get districts by city.
     */
    public function getDistricts(Request $request): JsonResponse
    {
        $request->validate([
            'city_id' => 'required|integer|exists:cities,id'
        ]);

        $districts = $this->areaService->getDistrictsByCity($request->city_id);
        return response()->json($districts);
    }
}
