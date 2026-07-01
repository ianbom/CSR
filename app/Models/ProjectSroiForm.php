<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectSroiForm extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'project_id',
        'source_template_id',
        'name',
        'description',
        'version',
        'status',
        'created_by',
        'activated_at',
    ];

    protected function casts(): array
    {
        return [
            'activated_at' => 'datetime',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function sourceTemplate(): BelongsTo
    {
        return $this->belongsTo(SroiTemplate::class, 'source_template_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(ProjectSroiSection::class, 'form_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(ProjectSroiQuestion::class, 'form_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class, 'project_sroi_form_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
