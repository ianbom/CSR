<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class EnumeratorService
{
    /**
     * Get all enumerators for a company with stats.
     */
    public function getEnumeratorsByCompany(int $companyId, array $params = []): array
    {
        $query = User::where('company_id', $companyId)
            ->where('role', 'enumerator')
            ->withCount([
                'submissions',
                'assignedProjects as active_projects_count' => function ($q) {
                    $q->where('projects.status', 'active');
                },
            ]);

        if (!empty($params['search'])) {
            $search = $params['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $query->orderBy('name', 'asc');

        return $query->get()->map(function ($user) {
            return [
                'id'             => $user->id,
                'name'           => $user->name,
                'email'          => $user->email,
                'phone'          => $user->phone,
                'isActive'       => $user->is_active,
                'submissions'    => $user->submissions_count ?? 0,
                'activeProjects' => $user->active_projects_count ?? 0,
                'createdAt'      => $user->created_at?->format('Y-m-d'),
            ];
        })->toArray();
    }

    /**
     * Get a single enumerator for editing.
     */
    public function getEnumeratorForEdit(int $enumeratorId, int $companyId): array
    {
        $user = User::where('id', $enumeratorId)
            ->where('company_id', $companyId)
            ->where('role', 'enumerator')
            ->firstOrFail();

        return [
            'id'        => $user->id,
            'name'      => $user->name,
            'email'     => $user->email,
            'phone'     => $user->phone ?? '',
            'is_active' => $user->is_active,
        ];
    }

    /**
     * Create a new enumerator.
     */
    public function createEnumerator(array $data, int $companyId): User
    {
        return User::create([
            'name'       => $data['name'],
            'email'      => $data['email'],
            'password'   => Hash::make($data['password']),
            'phone'      => $data['phone'] ?? null,
            'role'       => 'enumerator',
            'company_id' => $companyId,
            'is_active'  => $data['is_active'] ?? true,
        ]);
    }

    /**
     * Update an existing enumerator.
     */
    public function updateEnumerator(int $enumeratorId, array $data, int $companyId): User
    {
        $user = User::where('id', $enumeratorId)
            ->where('company_id', $companyId)
            ->where('role', 'enumerator')
            ->firstOrFail();

        $updateData = [
            'name'      => $data['name'],
            'email'     => $data['email'],
            'phone'     => $data['phone'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ];

        if (!empty($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        $user->update($updateData);

        return $user;
    }

    /**
     * Delete (soft-delete) an enumerator.
     */
    public function deleteEnumerator(int $enumeratorId, int $companyId): void
    {
        $user = User::where('id', $enumeratorId)
            ->where('company_id', $companyId)
            ->where('role', 'enumerator')
            ->firstOrFail();

        $user->delete();
    }
}
