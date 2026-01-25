<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SroiQuestion extends Model
{
    protected $fillable = [
        'company_id',
        'project_id',
        'code',
        'question_text',
        'answer_type',
        'required',
        'weight',
        'order_no',
    ];

    protected function casts(): array
    {
        return [
            'required' => 'boolean',
            'weight' => 'decimal:3',
        ];
    }

    /**
     * Get the company that owns the question.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the project that owns the question.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the submission answers for this question.
     */
    public function submissionAnswers(): HasMany
    {
        return $this->hasMany(SubmissionSroiAnswer::class);
    }
}
