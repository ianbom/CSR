<?php

namespace App\Services;

use App\Models\Company;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CompanyService
{
    /**
     * Get paginated companies with stats.
     */
    public function getAllCompanies(array $params = []): LengthAwarePaginator
    {
        $query = Company::query()
            ->withCount(['users', 'projects']);

        // Search
        if (!empty($params['search'])) {
            $search = $params['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('legal_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Status filter
        if (!empty($params['status']) && $params['status'] !== 'all') {
            $query->where('status', $params['status']);
        }

        // Sorting
        $sortBy = $params['sort_by'] ?? 'created_at';
        $sortOrder = $params['sort_order'] ?? 'desc';
        $allowed = ['name', 'email', 'status', 'created_at'];
        if (in_array($sortBy, $allowed)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $params['per_page'] ?? 10;
        $paginated = $query->paginate($perPage)->withQueryString();

        $paginated->getCollection()->transform(function ($company) {
            return [
                'id'           => $company->id,
                'name'         => $company->name,
                'legal_name'   => $company->legal_name,
                'email'        => $company->email,
                'phone'        => $company->phone,
                'address'      => $company->address,
                'status'       => $company->status,
                'usersCount'   => $company->users_count ?? 0,
                'projectsCount'=> $company->projects_count ?? 0,
                'createdAt'    => $company->created_at?->format('d M Y'),
            ];
        });

        return $paginated;
    }

    /**
     * Get summary statistics for companies.
     */
    public function getCompanySummary(): array
    {
        $total = Company::count();
        $active = Company::where('status', 'active')->count();
        $pending = Company::where('status', 'pending')->count();
        $suspended = Company::where('status', 'suspended')->count();

        return [
            'totalCompanies'     => $total,
            'activeCompanies'    => $active,
            'pendingCompanies'   => $pending,
            'suspendedCompanies' => $suspended,
        ];
    }

    /**
     * Create a new company.
     */
    public function createCompany(array $data): Company
    {
        return Company::create($data);
    }
}
