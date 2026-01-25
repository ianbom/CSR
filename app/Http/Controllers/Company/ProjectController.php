<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\CreateProjectRequest;
use App\Services\AreaService;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectController extends Controller
{
    protected ProjectService $projectService;
    protected AreaService $areaService;

    public function __construct(ProjectService $projectService, AreaService $areaService)
    {
        $this->projectService = $projectService;
        $this->areaService = $areaService;
    }

    public function listProjectPage()
    {
        $user = Auth::user();
        $companyId = $user->company_id;

        $projects = $this->projectService->getAllProjectsByCompany($companyId);
        $summary = $this->projectService->getProjectSummary($companyId);

        return Inertia::render('Company/Project/ListProject', [
            'projects' => $projects,
            'summary' => $summary,
        ]);
    }

    public function createProjectPage()
    {
        $provinces = $this->areaService->getAllProvinces();

        return Inertia::render('Company/Project/CreateProject', [
            'provinces' => $provinces,
        ]);
    }

    public function storeProject(CreateProjectRequest $request)
    {
        try {
        $user = Auth::user();
        $companyId = $user->company_id;

        $project = $this->projectService->createProject(
            $request->validated(),
            $companyId,
            $user->id
        );

        return redirect()
            ->route('company.projects.show', $project->id)
            ->with('success', 'Proyek berhasil dibuat.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat membuat proyek: ' . $th->getMessage());
        }

    }
}
