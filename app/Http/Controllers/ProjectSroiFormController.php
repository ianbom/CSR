<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectSroi\CopyProjectSroiFormRequest;
use App\Http\Requests\ProjectSroi\StoreProjectSroiQuestionRequest;
use App\Http\Requests\ProjectSroi\StoreProjectSroiSectionRequest;
use App\Http\Requests\ProjectSroi\UpdateProjectSroiFormRequest;
use App\Http\Requests\ProjectSroi\UpdateProjectSroiQuestionRequest;
use App\Http\Requests\ProjectSroi\UpdateProjectSroiSectionRequest;
use App\Models\Project;
use App\Models\ProjectSroiForm;
use App\Models\ProjectSroiQuestion;
use App\Models\ProjectSroiSection;
use App\Models\SroiTemplate;
use App\Services\ProjectSroiFormService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProjectSroiFormController extends Controller
{
    public function __construct(private ProjectSroiFormService $projectSroiFormService) {}

    public function preview(Project $project, ProjectSroiForm $form): Response
    {
        $this->authorizeCompanyForm($project, $form);

        $form->load([
            'sourceTemplate',
            'project.company',
            'sections' => fn ($query) => $query->orderBy('order_no')->orderBy('id'),
            'sections.questions' => fn ($query) => $query->active()->orderBy('order_no')->orderBy('id'),
        ]);

        return Inertia::render('Project/PreviewSROIForms', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'projectCode' => $project->project_code,
                'companyName' => $project->company?->name,
            ],
            'form' => [
                'id' => $form->id,
                'name' => $form->name,
                'description' => $form->description,
                'version' => $form->version,
                'status' => $form->status,
                'sourceTemplateName' => $form->sourceTemplate?->name,
            ],
            'sections' => $form->sections->map(fn (ProjectSroiSection $section) => [
                'id' => $section->id,
                'title' => $section->title,
                'description' => $section->description,
                'orderNo' => $section->order_no,
                'questions' => $section->questions->map(fn (ProjectSroiQuestion $question) => [
                    'id' => $question->id,
                    'code' => $question->code,
                    'questionText' => $question->question_text,
                    'helpText' => $question->help_text,
                    'answerType' => $question->answer_type,
                    'unit' => $question->unit,
                    'isRequired' => $question->is_required,
                    'isGroup' => $question->is_group,
                    'parentQuestionId' => $question->parent_question_id,
                    'orderNo' => $question->order_no,
                ])->values()->toArray(),
            ])->values()->toArray(),
        ]);
    }

    public function store(CopyProjectSroiFormRequest $request, Project $project): RedirectResponse
    {
        $this->authorizeCompanyProject($project);

        $template = SroiTemplate::active()->findOrFail($request->integer('template_id'));

        $this->projectSroiFormService->copyTemplateToProject($project, $template, Auth::id());

        return redirect()
            ->route('projects.show', ['id' => $project->id, 'detailType' => 'sroi'])
            ->with('success', 'Template SROI berhasil digunakan untuk proyek ini.');
    }

    public function update(UpdateProjectSroiFormRequest $request, Project $project, ProjectSroiForm $form): RedirectResponse
    {
        $this->authorizeCompanyForm($project, $form);

        $this->projectSroiFormService->updateForm($form, $request->validated());

        return redirect()->back()->with('success', 'Form SROI berhasil diperbarui.');
    }

    public function storeSection(StoreProjectSroiSectionRequest $request, Project $project, ProjectSroiForm $form): RedirectResponse
    {
        $this->authorizeCompanyForm($project, $form);

        $data = $request->validated();
        $data['form_id'] = $form->id;
        $data['order_no'] = $data['order_no'] ?? $this->nextSectionOrder($form);

        ProjectSroiSection::create($data);

        return redirect()->back()->with('success', 'Section SROI berhasil ditambahkan.');
    }

    public function updateSection(UpdateProjectSroiSectionRequest $request, Project $project, ProjectSroiForm $form, ProjectSroiSection $section): RedirectResponse
    {
        $this->authorizeCompanySection($project, $form, $section);

        $section->update($request->validated());

        return redirect()->back()->with('success', 'Section SROI berhasil diperbarui.');
    }

    public function destroySection(Project $project, ProjectSroiForm $form, ProjectSroiSection $section): RedirectResponse
    {
        $this->authorizeCompanySection($project, $form, $section);

        DB::transaction(function () use ($section) {
            ProjectSroiQuestion::where('section_id', $section->id)->delete();
            $section->delete();
        });

        return redirect()->back()->with('success', 'Section SROI berhasil dihapus.');
    }

    public function storeQuestion(StoreProjectSroiQuestionRequest $request, Project $project, ProjectSroiForm $form): RedirectResponse
    {
        $this->authorizeCompanyForm($project, $form);

        $data = $this->validatedQuestionData($request->validated(), $form);
        $data['form_id'] = $form->id;
        $data['order_no'] = $data['order_no'] ?? $this->nextQuestionOrder($form, (int) $data['section_id']);

        ProjectSroiQuestion::create($data);

        return redirect()->back()->with('success', 'Pertanyaan SROI berhasil ditambahkan.');
    }

    public function updateQuestion(UpdateProjectSroiQuestionRequest $request, Project $project, ProjectSroiForm $form, ProjectSroiQuestion $question): RedirectResponse
    {
        $this->authorizeCompanyQuestion($project, $form, $question);

        $question->update($this->validatedQuestionData($request->validated(), $form, $question));

        return redirect()->back()->with('success', 'Pertanyaan SROI berhasil diperbarui.');
    }

    public function destroyQuestion(Project $project, ProjectSroiForm $form, ProjectSroiQuestion $question): RedirectResponse
    {
        $this->authorizeCompanyQuestion($project, $form, $question);

        $question->delete();

        return redirect()->back()->with('success', 'Pertanyaan SROI berhasil dihapus.');
    }

    protected function authorizeCompanyProject(Project $project): void
    {
        abort_unless($project->company_id === Auth::user()?->company_id, 404);
    }

    protected function authorizeCompanyForm(Project $project, ProjectSroiForm $form): void
    {
        $this->authorizeCompanyProject($project);

        abort_unless($form->project_id === $project->id && $form->company_id === $project->company_id, 404);
    }

    protected function authorizeCompanySection(Project $project, ProjectSroiForm $form, ProjectSroiSection $section): void
    {
        $this->authorizeCompanyForm($project, $form);

        abort_unless($section->form_id === $form->id, 404);
    }

    protected function authorizeCompanyQuestion(Project $project, ProjectSroiForm $form, ProjectSroiQuestion $question): void
    {
        $this->authorizeCompanyForm($project, $form);

        abort_unless($question->form_id === $form->id, 404);
    }

    protected function validatedQuestionData(array $data, ProjectSroiForm $form, ?ProjectSroiQuestion $question = null): array
    {
        if (array_key_exists('section_id', $data)) {
            abort_unless(ProjectSroiSection::where('form_id', $form->id)->whereKey($data['section_id'])->exists(), 422);
        }

        if (array_key_exists('parent_question_id', $data) && $data['parent_question_id'] !== null) {
            $parentQuery = ProjectSroiQuestion::where('form_id', $form->id)->whereKey($data['parent_question_id']);
            if ($question !== null) {
                $parentQuery->whereKeyNot($question->id);
            }
            abort_unless($parentQuery->exists(), 422);
        }

        if (($data['is_group'] ?? false) === true) {
            $data['answer_type'] = null;
            $data['is_required'] = false;
        }

        return $data;
    }

    protected function nextSectionOrder(ProjectSroiForm $form): int
    {
        return ((int) ProjectSroiSection::where('form_id', $form->id)->max('order_no')) + 1;
    }

    protected function nextQuestionOrder(ProjectSroiForm $form, int $sectionId): int
    {
        return ((int) ProjectSroiQuestion::where('form_id', $form->id)->where('section_id', $sectionId)->max('order_no')) + 1;
    }
}
