<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class UserService
{
    protected const ALLOWED_SORTS = ['name', 'email', 'role', 'is_active', 'created_at'];

    public function getUserList(array $params = []): LengthAwarePaginator
    {
        $query = User::query()->with('company');

        $this->applySearchFilter($query, $params['search'] ?? null);
        $this->applyRoleFilter($query, $params['role'] ?? null);
        $this->applyStatusFilter($query, $params['status'] ?? null);
        $this->applySorting($query, $params['sort_by'] ?? null, $params['sort_order'] ?? null);

        $perPage = $params['per_page'] ?? 10;

        return $query->paginate($perPage)->withQueryString();
    }

    public function getUserSummary(): array
    {
        $users = User::query();

        return [
            'totalUsers' => (clone $users)->count(),
            'activeUsers' => (clone $users)->where('is_active', true)->count(),
            'inactiveUsers' => (clone $users)->where('is_active', false)->count(),
            'adminCount' => (clone $users)->whereIn('role', ['admin', 'superadmin'])->count(),
            'companyCount' => (clone $users)->where('role', 'company')->count(),
            'enumeratorCount' => (clone $users)->where('role', 'enumerator')->count(),
        ];
    }

    protected function applySearchFilter(Builder $query, ?string $search): void
    {
        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('company', function ($cq) use ($search) {
                        $cq->where('name', 'like', "%{$search}%");
                    });
            });
        }
    }

    protected function applyRoleFilter(Builder $query, ?string $role): void
    {
        if (! empty($role) && $role !== 'all') {
            $query->where('role', $role);
        }
    }

    protected function applyStatusFilter(Builder $query, ?string $status): void
    {
        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }
    }

    protected function applySorting(Builder $query, ?string $sortBy, ?string $sortOrder): void
    {
        $sortBy = $sortBy ?? 'created_at';
        $sortOrder = $sortOrder ?? 'desc';

        if (in_array($sortBy, self::ALLOWED_SORTS)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }
    }

    public function createUser(array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($data['password']);
        }
        
        return User::create($data);
    }

    public function updateUser(int $id, array $data): User
    {
        $user = User::findOrFail($id);

        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        return $user;
    }
}
