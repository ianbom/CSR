<?php

namespace App\Http\Controllers\Enumerator;

use App\Http\Controllers\Controller;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    protected $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function listProjectPage(Request $request)
    {
        $user = $request->user();

        $projects = $this->projectService->getProjectsByEnumerator(
            $user->id,
            $request->all()
        );

        return Inertia::render('Enumerator/Project/ListProject', [
            'projects' => $projects,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_order']),
        ]);
    }

    public function listSroiPage(Request $request): Response
    {
        abort_unless($request->user()?->role === 'enumerator', 403);

        $projects = $this->projectService->getSroiProjectsByEnumerator(
            $request->user()->id,
            $request->only(['search', 'status', 'sort_by', 'sort_order', 'per_page']),
        );

        return Inertia::render('Enumerator/SROI/ListSroi', [
            'projects' => $projects,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_order']),
        ]);
    }
}
