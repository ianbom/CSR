<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TemplateQuestion extends Model
{
    use SoftDeletes;

    public $timestamps = false;

    protected $fillable = [
        'template_id',
        'category',
        'code',
        'aspect',
        'question_text',
        'order_no',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    /**
     * Get the template that owns the question.
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(InstrumentTemplate::class, 'template_id');
    }

    /**
     * Get the submission answers for this question.
     */
    public function submissionAnswers(): HasMany
    {
        return $this->hasMany(SubmissionTemplateAnswer::class, 'question_id');
    }
}
