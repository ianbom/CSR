<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubmissionTemplateAnswer extends Model
{
    use SoftDeletes;

    public $timestamps = false;

    protected $fillable = [
        'submission_id',
        'question_id',
        'type',
        'value',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    /**
     * Get the submission that owns the answer.
     */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    /**
     * Get the question for this answer.
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(TemplateQuestion::class, 'question_id');
    }
}
