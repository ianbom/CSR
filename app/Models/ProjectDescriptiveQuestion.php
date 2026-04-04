<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectDescriptiveQuestion extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'project_id',
        'title',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function submissionDescriptiveAnswers(): HasMany
    {
        return $this->hasMany(SubmissionDescriptiveAnswer::class);
    }
}
