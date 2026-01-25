<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubmissionSroiAnswer extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'submission_id',
        'sroi_question_id',
        'value_number',
        'value_text',
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
     * Get the SROI question for this answer.
     */
    public function sroiQuestion(): BelongsTo
    {
        return $this->belongsTo(SroiQuestion::class);
    }
}
