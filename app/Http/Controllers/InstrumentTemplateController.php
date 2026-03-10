<?php

namespace App\Http\Controllers;

use App\Http\Requests\InstrumentTemplate\StoreInstrumentTemplateRequest;
use App\Http\Requests\InstrumentTemplate\UpdateInstrumentTemplateRequest;
use App\Http\Requests\TemplateQuestion\StoreTemplateQuestionRequest;
use App\Http\Requests\TemplateQuestion\UpdateTemplateQuestionRequest;
use App\Services\InstrumentTemplateService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstrumentTemplateController extends Controller
{
    protected InstrumentTemplateService $templateService;

    public function __construct(InstrumentTemplateService $templateService)
    {
        $this->templateService = $templateService;
    }

    public function index(Request $request)
    {
        $params = [
            'search' => $request->input('search'),
            'type' => $request->input('type', 'all'),
            'status' => $request->input('status', 'all'),
            'sort_by' => $request->input('sort_by', 'created_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
            'per_page' => $request->input('per_page', 10),
        ];

        $templates = $this->templateService->getAllTemplates($params);
        $summary = $this->templateService->getTemplateSummary();

        return Inertia::render('Instrument/ListInstrument', [
            'templates' => $templates,
            'summary' => $summary,
            'filters' => $params,
        ]);
    }

    public function store(StoreInstrumentTemplateRequest $request)
    {
        try {
            $this->templateService->createTemplate($request->validated());

            return redirect()->back()->with('success', 'Template berhasil dibuat.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Gagal membuat template: '.$th->getMessage());
        }
    }

    public function update(UpdateInstrumentTemplateRequest $request, int $id)
    {
        try {
            $this->templateService->updateTemplate($id, $request->validated());

            return redirect()->back()->with('success', 'Template berhasil diperbarui.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Gagal memperbarui template: '.$th->getMessage());
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->templateService->deleteTemplate($id);

            return redirect()->back()->with('success', 'Template berhasil dihapus.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Gagal menghapus template: '.$th->getMessage());
        }
    }

    public function show(int $id)
    {
        $data = $this->templateService->getTemplateDetail($id);

        return Inertia::render('Instrument/DetailInstrument', [
            'template' => $data['template'],
            'questions' => $data['questions'],
        ]);
    }

    public function storeQuestion(StoreTemplateQuestionRequest $request, int $templateId)
    {
        try {
            $this->templateService->createQuestion($templateId, $request->validated());

            return redirect()->back()->with('success', 'Pertanyaan berhasil ditambahkan.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Gagal menambahkan pertanyaan: '.$th->getMessage());
        }
    }

    public function updateQuestion(UpdateTemplateQuestionRequest $request, int $templateId, int $questionId)
    {
        try {
            $this->templateService->updateQuestion($questionId, $request->validated());

            return redirect()->back()->with('success', 'Pertanyaan berhasil diperbarui.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Gagal memperbarui pertanyaan: '.$th->getMessage());
        }
    }

    public function destroyQuestion(int $templateId, int $questionId)
    {
        try {
            $this->templateService->deleteQuestion($questionId);

            return redirect()->back()->with('success', 'Pertanyaan berhasil dihapus.');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Gagal menghapus pertanyaan: '.$th->getMessage());
        }
    }
}
