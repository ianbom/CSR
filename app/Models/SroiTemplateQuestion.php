<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SroiTemplateQuestion extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'template_id',
        'section_id',
        'parent_question_id',
        'code',
        'question_text',
        'help_text',
        'answer_type',
        'unit',
        'is_required',
        'is_group',
        'is_calculated',
        'order_no',
    ];

    protected function casts(): array
    {
        return [
            'is_required' => 'boolean',
            'is_group' => 'boolean',
            'is_calculated' => 'boolean',
        ];
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(SroiTemplate::class, 'template_id');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(SroiTemplateSection::class, 'section_id');
    }

    public function parentQuestion(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_question_id');
    }

    public function childQuestions(): HasMany
    {
        return $this->hasMany(self::class, 'parent_question_id');
    }

    public function projectQuestions(): HasMany
    {
        return $this->hasMany(ProjectSroiQuestion::class, 'source_template_question_id');
    }
}
