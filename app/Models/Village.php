<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Village extends Model
{
    protected $fillable = [
        'district_id',
        'code',
        'name',
    ];

    /**
     * Get the district that owns the village.
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    /**
     * Get the city through district.
     */
    public function city()
    {
        return $this->hasOneThrough(
            City::class,
            District::class,
            'id',
            'id',
            'district_id',
            'city_id'
        );
    }

    /**
     * Get the province through district and city.
     */
    public function province()
    {
        return $this->district->city->province ?? null;
    }
}
