<?php

namespace App\Http\Controllers;

use App\Services\CompanyService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    protected CompanyService $companyService;

    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }

    public function index(Request $request)
    {
        $params = [
            'search'     => $request->input('search'),
            'status'     => $request->input('status', 'all'),
            'sort_by'    => $request->input('sort_by', 'created_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
            'per_page'   => $request->input('per_page', 10),
        ];

        $companies = $this->companyService->getAllCompanies($params);
        $summary = $this->companyService->getCompanySummary();

        return Inertia::render('Companies/ListCompany', [
            'companies' => $companies,
            'summary'   => $summary,
            'filters'   => $params,
        ]);
    }

    public function store(\App\Http\Requests\Company\StoreCompanyRequest $request)
    {
        $this->companyService->createCompany($request->validated());

        return redirect()->back()->with('success', 'Perusahaan berhasil ditambahkan.');
    }
}
