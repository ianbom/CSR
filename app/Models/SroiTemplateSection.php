<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SroiTemplateSection extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'template_id',
        'title',
        'description',
        'order_no',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(SroiTemplate::class, 'template_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(SroiTemplateQuestion::class, 'section_id');
    }

    public function projectSections(): HasMany
    {
        return $this->hasMany(ProjectSroiSection::class, 'source_template_section_id');
    }
}
