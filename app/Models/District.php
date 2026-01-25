<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class District extends Model
{
    protected $fillable = [
        'city_id',
        'code',
        'name',
    ];

    /**
     * Get the city that owns the district.
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    /**
     * Get the province through city.
     */
    public function province()
    {
        return $this->hasOneThrough(
            Province::class,
            City::class,
            'id',
            'id',
            'city_id',
            'province_id'
        );
    }

    /**
     * Get the project locations for this district.
     */
    public function projectLocations(): HasMany
    {
        return $this->hasMany(ProjectLocation::class);
    }
}
