<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubmissionSroiAnswer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'submission_id',
        'project_sroi_question_id',
        'value_number',
        'value_text',
    ];

    protected function casts(): array
    {
        return [
            'value_number' => 'decimal:2',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
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
     * Get the project SROI question for this answer.
     */
    public function projectSroiQuestion(): BelongsTo
    {
        return $this->belongsTo(ProjectSroiQuestion::class, 'project_sroi_question_id');
    }
}
