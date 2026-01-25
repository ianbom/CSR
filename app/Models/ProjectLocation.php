<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectLocation extends Model
{
    protected $fillable = [
        'company_id',
        'project_id',
        'district_id',
    ];

    /**
     * Get the company that owns the project location.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the project that owns the location.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the district for this location.
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }
}
