<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\CreateProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Models\Project;
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

    public function listProjectPage(Request $request)
    {
        $user = Auth::user();
        $companyId = $user->company_id;

        $params = [
            'search' => $request->input('search'),
            'status' => $request->input('status', 'all'),
            'sort_by' => $request->input('sort_by', 'created_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
            'per_page' => $request->input('per_page', 10),
        ];

        $projects = $this->projectService->getAllProjectsByCompany($companyId, $params);
        $summary = $this->projectService->getProjectSummary($companyId);
        $enumerators = $this->projectService->getEnumeratorsByCompany($companyId);
        $provinces = $this->areaService->getAllProvinces();

        return Inertia::render('Company/Project/ListProject', [
            'projects' => $projects,
            'summary' => $summary,
            'enumerators' => $enumerators,
            'filters' => $params,
            'provinces' => $provinces,
        ]);
    }

    public function detailProject(Request $request, int $id)
    {
        $detailType = $request->input('detailType', 'overview');
        $data = $this->projectService->getProjectDetail($id, $detailType);

        return Inertia::render('Company/Project/DetailProject', [
            'project'        => $data['project'],
            'detailType'     => $detailType,
            'stats'          => $data['stats'],
            'demographics'   => $data['demographics'],
            'questionScores' => $data['questionScores'],
            'auditLog'       => $data['auditLog'],
            'trendData'      => $data['trendData'],
            'respondents'    => $data['respondents'],
            'enumeratorList' => $data['enumeratorList'],
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
            ->route('projects.show', $project->id)
            ->with('success', 'Proyek berhasil dibuat.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat membuat proyek: ' . $th->getMessage());
        }

    }

    public function updateProject(UpdateProjectRequest $request, int $id)
    {
        try {
            $user = Auth::user();
            $companyId = $user->company_id;

            $this->projectService->updateProject(
                $id,
                $request->validated(),
                $companyId
            );

            return redirect()->back()->with('success', 'Proyek berhasil diperbarui.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function getProjectForEdit(int $id)
    {
        $user = Auth::user();
        $data = $this->projectService->getProjectForEdit($id, $user->company_id);

        return response()->json($data);
    }

    public function getProjectEnumerators(int $projectId)
    {
        $user = Auth::user();
        $enumerators = $this->projectService->getProjectEnumerators($projectId, $user->company_id);

        return response()->json($enumerators);
    }

    public function assignEnumerators(Request $request, int $projectId)
    {
        $request->validate([
            'enumerator_ids' => 'array',
            'enumerator_ids.*' => 'integer|exists:users,id',
        ]);

        $user = Auth::user();
        $companyId = $user->company_id;

        $this->projectService->assignEnumeratorsToProject(
            $projectId,
            $request->input('enumerator_ids', []),
            $companyId
        );

        return redirect()->back()->with('success', 'Enumerator berhasil di-assign.');
    }
}
