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
        $companies = \App\Models\Company::select('id', 'name')->get();

        return Inertia::render('User/ListUser', [
            'users' => $users,
            'summary' => $summary,
            'companies' => $companies,
            'filters' => $request->only(['search', 'role', 'status', 'sort_by', 'sort_order', 'per_page']),
        ]);
    }

    public function store(\App\Http\Requests\User\StoreUserRequest $request)
    {
        $this->userService->createUser($request->validated());

        return redirect()->route('users.index')->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function update(\App\Http\Requests\User\UpdateUserRequest $request, $id)
    {
        $this->userService->updateUser($id, $request->validated());

        return redirect()->route('users.index')->with('success', 'Data pengguna berhasil diperbarui.');
    }
}
