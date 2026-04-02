<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $dashboardService) {}

    public function dashboard()
    {
        $user = Auth::user();

        if ($user->role == 'admin' || $user->role == 'superadmin') {
            return Inertia::render('Dashboard/AdminDashboard');
        }

        if ($user->role == 'company') {
            $data = $this->dashboardService->getCompanyDashboardData($user->company_id);

            return Inertia::render('Dashboard/CompanyDashboard', $data);
        }

        if ($user->role == 'enumerator') {
            return Inertia::render('Enumerator/Project/ListProject');
        }

        return Inertia::render('Company/Dashboard');
    }
}
