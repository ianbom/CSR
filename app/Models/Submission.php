<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Submission extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'company_id',
        'project_id',
        'assessment_type',
        'respondent_id',
        'enumerator_id',
        'status',
        'photo_path',
        'photo_mime',
        'photo_size_bytes',
        'maps_url',
        'submitted_at',
        'reviewed_by',
        'reviewed_at',
        'review_note',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    /**
     * Get the company that owns the submission.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the project that owns the submission.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the respondent for the submission.
     */
    public function respondent(): BelongsTo
    {
        return $this->belongsTo(Respondent::class);
    }

    /**
     * Get the enumerator (user) who made the submission.
     */
    public function enumerator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'enumerator_id');
    }

    /**
     * Get the reviewer (user) who reviewed the submission.
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Get the template answers for IKM/SLOI submissions.
     */
    public function templateAnswers(): HasMany
    {
        return $this->hasMany(SubmissionTemplateAnswer::class);
    }

    /**
     * Get the SROI answers for SROI submissions.
     */
    public function sroiAnswers(): HasMany
    {
        return $this->hasMany(SubmissionSroiAnswer::class);
    }

    /**
     * Scope a query to only include IKM submissions.
     */
    public function scopeIkm($query)
    {
        return $query->where('assessment_type', 'IKM');
    }

    /**
     * Scope a query to only include SLOI submissions.
     */
    public function scopeSloi($query)
    {
        return $query->where('assessment_type', 'SLOI');
    }

    /**
     * Scope a query to only include SROI submissions.
     */
    public function scopeSroi($query)
    {
        return $query->where('assessment_type', 'SROI');
    }

    /**
     * Scope a query to only include submitted submissions.
     */
    public function scopeSubmitted($query)
    {
        return $query->where('status', 'submitted');
    }

    /**
     * Scope a query to only include approved submissions.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include rejected submissions.
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}
