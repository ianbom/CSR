<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InstrumentTemplate extends Model
{
    protected $fillable = [
        'type',
        'name',
        'version',
        'description',
        'is_active',
        'published_at',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    /**
     * Get the user who created the template.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the questions for the template.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(TemplateQuestion::class, 'template_id');
    }

    /**
     * Get the projects using this template for IKM.
     */
    public function ikmProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'ikm_template_id');
    }

    /**
     * Get the projects using this template for SLOI.
     */
    public function sloiProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'sloi_template_id');
    }

    /**
     * Scope a query to only include IKM templates.
     */
    public function scopeIkm($query)
    {
        return $query->where('type', 'IKM');
    }

    /**
     * Scope a query to only include SLOI templates.
     */
    public function scopeSloi($query)
    {
        return $query->where('type', 'SLOI');
    }

    /**
     * Scope a query to only include active templates.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
