<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SroiTemplate extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'version',
        'is_active',
        'created_by',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(SroiTemplateSection::class, 'template_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(SroiTemplateQuestion::class, 'template_id');
    }

    public function projectForms(): HasMany
    {
        return $this->hasMany(ProjectSroiForm::class, 'source_template_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
