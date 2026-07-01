<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectSroiQuestion extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'form_id',
        'section_id',
        'parent_question_id',
        'source_template_question_id',
        'question_text',
        'help_text',
        'answer_type',
        'unit',
        'is_group',
        'is_active',
        'order_no',
    ];

    protected function casts(): array
    {
        return [
            'is_group' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function form(): BelongsTo
    {
        return $this->belongsTo(ProjectSroiForm::class, 'form_id');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(ProjectSroiSection::class, 'section_id');
    }

    public function parentQuestion(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_question_id');
    }

    public function childQuestions(): HasMany
    {
        return $this->hasMany(self::class, 'parent_question_id');
    }

    public function sourceTemplateQuestion(): BelongsTo
    {
        return $this->belongsTo(SroiTemplateQuestion::class, 'source_template_question_id');
    }

    public function submissionAnswers(): HasMany
    {
        return $this->hasMany(SubmissionSroiAnswer::class, 'project_sroi_question_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
