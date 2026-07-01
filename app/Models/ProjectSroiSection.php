<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectSroiSection extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'form_id',
        'source_template_section_id',
        'title',
        'description',
        'order_no',
    ];

    public function form(): BelongsTo
    {
        return $this->belongsTo(ProjectSroiForm::class, 'form_id');
    }

    public function sourceTemplateSection(): BelongsTo
    {
        return $this->belongsTo(SroiTemplateSection::class, 'source_template_section_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(ProjectSroiQuestion::class, 'section_id');
    }
}
