<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(protected UserService $userService) {}

    public function index(Request $request)
    {

        $users = $this->userService->getUserList($request->all());
        $summary = $this->userService->getUserSummary();

        return Inertia::render('User/ListUser', [
            'users' => $users,
            'summary' => $summary,
            'filters' => $request->only(['search', 'role', 'status', 'sort_by', 'sort_order', 'per_page']),
        ]);
    }
}
