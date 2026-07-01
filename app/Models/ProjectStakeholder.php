<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectStakeholder extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'project_id',
        'name',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function respondents(): HasMany
    {
        return $this->hasMany(Respondent::class, 'stakeholder_id');
    }

    public function outcomes(): HasMany
    {
        return $this->hasMany(StakeholderOutcome::class, 'stakeholder_id');
    }
}
