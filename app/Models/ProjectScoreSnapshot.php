<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectScoreSnapshot extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'company_id',
        'project_id',
        'assessment_type',
        'calculated_at',
        'total_score',
        'details_json',
        'version',
    ];

    protected function casts(): array
    {
        return [
            'calculated_at' => 'datetime',
            'total_score' => 'decimal:4',
            'details_json' => 'array',
        ];
    }

    /**
     * Get the company that owns the snapshot.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the project that owns the snapshot.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Scope a query to only include IKM snapshots.
     */
    public function scopeIkm($query)
    {
        return $query->where('assessment_type', 'IKM');
    }

    /**
     * Scope a query to only include SLOI snapshots.
     */
    public function scopeSloi($query)
    {
        return $query->where('assessment_type', 'SLOI');
    }

    /**
     * Scope a query to only include SROI snapshots.
     */
    public function scopeSroi($query)
    {
        return $query->where('assessment_type', 'SROI');
    }
}
