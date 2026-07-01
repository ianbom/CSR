<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class StakeholderOutcome extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'stakeholder_id',
        'outcome',
    ];

    public function stakeholder(): BelongsTo
    {
        return $this->belongsTo(ProjectStakeholder::class, 'stakeholder_id');
    }
}
