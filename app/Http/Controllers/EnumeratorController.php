<?php

namespace App\Http\Controllers;

use App\Http\Requests\Enumerator\StoreEnumeratorRequest;
use App\Http\Requests\Enumerator\UpdateEnumeratorRequest;
use App\Services\EnumeratorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EnumeratorController extends Controller
{
    protected EnumeratorService $enumeratorService;

    public function __construct(EnumeratorService $enumeratorService)
    {
        $this->enumeratorService = $enumeratorService;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $companyId = $user->company_id;

        $params = [
            'search' => $request->input('search'),
        ];

        $enumerators = $this->enumeratorService->getEnumeratorsByCompany($companyId, $params);

        return Inertia::render('Company/Enumerator/ListEnumerator', [
            'enumerators' => $enumerators,
            'filters' => $params,
        ]);
    }

    public function store(StoreEnumeratorRequest $request)
    {
        try {
            $user = Auth::user();
            $this->enumeratorService->createEnumerator(
                $request->validated(),
                $user->company_id
            );

            return redirect()->back()->with('success', 'Enumerator berhasil ditambahkan.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Gagal menambahkan enumerator: '.$th->getMessage());
        }
    }

    public function getForEdit(int $id)
    {
        $user = Auth::user();
        $data = $this->enumeratorService->getEnumeratorForEdit($id, $user->company_id);

        return response()->json($data);
    }

    public function update(UpdateEnumeratorRequest $request, int $id)
    {
        try {
            $user = Auth::user();
            $this->enumeratorService->updateEnumerator(
                $id,
                $request->validated(),
                $user->company_id
            );

            return redirect()->back()->with('success', 'Enumerator berhasil diperbarui.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Gagal memperbarui enumerator: '.$th->getMessage());
        }
    }

    public function destroy(int $id)
    {
        try {
            $user = Auth::user();
            $this->enumeratorService->deleteEnumerator($id, $user->company_id);

            return redirect()->back()->with('success', 'Enumerator berhasil dihapus.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Gagal menghapus enumerator: '.$th->getMessage());
        }
    }

    public function show(Request $request, int $id)
    {
        $user = Auth::user();
        $tab = $request->input('tab', 'profile');

        $respondentParams = [
            'status' => $request->input('resp_status'),
            'education' => $request->input('education'),
            'gender' => $request->input('gender'),
            'sort_by' => $request->input('sort_by', 'submitted_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
            'per_page' => $request->input('per_page', 10),
            'page' => $request->input('page', 1),
        ];

        $data = $this->enumeratorService->getEnumeratorDetail(
            $id,
            $user->company_id,
            $tab,
            $respondentParams
        );

        return Inertia::render('Company/Enumerator/DetailEnumerator', $data);
    }
}
