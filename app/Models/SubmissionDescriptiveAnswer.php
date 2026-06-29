<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubmissionDescriptiveAnswer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'submission_id',
        'project_descriptive_question_id',
        'answer',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function projectDescriptiveQuestion(): BelongsTo
    {
        return $this->belongsTo(ProjectDescriptiveQuestion::class);
    }
}
