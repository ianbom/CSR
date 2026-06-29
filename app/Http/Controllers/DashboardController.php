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
            $data = $this->dashboardService->getAdminDashboardData();

            return Inertia::render('Dashboard/AdminDashboard', $data);
        }

        if ($user->role == 'company') {
            $selectedProjectId = request('project_id', null);
            $data = $this->dashboardService->getCompanyDashboardData($user->company_id, $selectedProjectId);

            return Inertia::render('Dashboard/CompanyDashboard', $data);
        }

        if ($user->role == 'enumerator') {
            return redirect()->route('enumerator.list-survey');
        }

        return Inertia::render('Welcome');
    }
}
