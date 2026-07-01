<?php

use App\Models\Company;
use App\Models\Project;
use App\Models\ProjectSroiForm;
use App\Models\ProjectSroiQuestion;
use App\Models\SroiTemplate;
use App\Models\SroiTemplateQuestion;
use App\Models\SroiTemplateSection;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function createSroiProjectFixture(bool $templateActive = true): array
{
    $company = Company::create(['name' => 'PT SROI']);
    $user = User::factory()->create([
        'company_id' => $company->id,
        'role' => 'company',
    ]);

    $project = Project::create([
        'company_id' => $company->id,
        'name' => 'Program SROI',
        'project_code' => 'SROI-01',
        'status' => 'draft',
        'enable_sroi' => true,
        'created_by' => $user->id,
    ]);

    $template = SroiTemplate::create([
        'name' => 'Template SROI Dasar',
        'description' => 'Template dasar',
        'version' => 1,
        'is_active' => $templateActive,
        'created_by' => $user->id,
    ]);

    $section = SroiTemplateSection::create([
        'template_id' => $template->id,
        'title' => 'Outcome',
        'order_no' => 1,
    ]);

    $group = SroiTemplateQuestion::create([
        'template_id' => $template->id,
        'section_id' => $section->id,
        'question_text' => 'Peningkatan Pendapatan',
        'answer_type' => null,
        'is_group' => true,
        'order_no' => 1,
    ]);

    $child = SroiTemplateQuestion::create([
        'template_id' => $template->id,
        'section_id' => $section->id,
        'parent_question_id' => $group->id,
        'question_text' => 'Pendapatan setelah program',
        'answer_type' => 'number',
        'unit' => 'rupiah_per_bulan',
        'order_no' => 2,
    ]);

    return compact('company', 'user', 'project', 'template', 'section', 'group', 'child');
}

it('shows active SROI template options on the project SROI tab', function () {
    $fixture = createSroiProjectFixture();

    $response = $this->actingAs($fixture['user'])->get(route('projects.show', [
        'id' => $fixture['project']->id,
        'detailType' => 'sroi',
    ]));

    $response
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Project/DetailProject')
            ->where('detailType', 'sroi')
            ->has('sroiTemplates', 1)
            ->where('sroiTemplates.0.name', 'Template SROI Dasar')
            ->where('sroiTemplates.0.sectionCount', 1)
            ->where('sroiTemplates.0.questionCount', 2)
            ->where('projectSroiForm', null)
        );
});

it('copies an active SROI template to a project form with parent mapping', function () {
    $fixture = createSroiProjectFixture();

    $response = $this->actingAs($fixture['user'])->post(route('projects.sroi.forms.store', $fixture['project']), [
        'template_id' => $fixture['template']->id,
    ]);

    $response->assertRedirect(route('projects.show', ['id' => $fixture['project']->id, 'detailType' => 'sroi']));

    $form = ProjectSroiForm::with('sections.questions')->firstOrFail();
    $copiedGroup = ProjectSroiQuestion::where('source_template_question_id', $fixture['group']->id)->firstOrFail();
    $copiedChild = ProjectSroiQuestion::where('source_template_question_id', $fixture['child']->id)->firstOrFail();

    expect($form->project_id)->toBe($fixture['project']->id)
        ->and($form->status)->toBe('draft')
        ->and($form->sections)->toHaveCount(1)
        ->and($form->sections->first()->questions)->toHaveCount(2)
        ->and($copiedChild->parent_question_id)->toBe($copiedGroup->id);
});

it('rejects inactive SROI templates when copying to a project form', function () {
    $fixture = createSroiProjectFixture(false);

    $response = $this->actingAs($fixture['user'])->from(route('projects.show', [
        'id' => $fixture['project']->id,
        'detailType' => 'sroi',
    ]))->post(route('projects.sroi.forms.store', $fixture['project']), [
        'template_id' => $fixture['template']->id,
    ]);

    $response->assertRedirect(route('projects.show', ['id' => $fixture['project']->id, 'detailType' => 'sroi']));
    $response->assertSessionHasErrors('template_id');
    expect(ProjectSroiForm::count())->toBe(0);
});

it('prevents another company from mutating a project SROI form', function () {
    $fixture = createSroiProjectFixture();
    $this->actingAs($fixture['user'])->post(route('projects.sroi.forms.store', $fixture['project']), [
        'template_id' => $fixture['template']->id,
    ]);
    $form = ProjectSroiForm::firstOrFail();

    $otherCompany = Company::create(['name' => 'PT Lain']);
    $otherUser = User::factory()->create([
        'company_id' => $otherCompany->id,
        'role' => 'company',
    ]);

    $response = $this->actingAs($otherUser)->patch(route('projects.sroi.forms.update', [$fixture['project'], $form]), [
        'name' => 'Should Fail',
    ]);

    $response->assertNotFound();
});

it('updates project SROI sections and questions', function () {
    $fixture = createSroiProjectFixture();
    $this->actingAs($fixture['user'])->post(route('projects.sroi.forms.store', $fixture['project']), [
        'template_id' => $fixture['template']->id,
    ]);

    $form = ProjectSroiForm::firstOrFail();
    $section = $form->sections()->firstOrFail();
    $question = $form->questions()->where('question_text', 'Pendapatan setelah program')->firstOrFail();

    $this->actingAs($fixture['user'])->patch(route('projects.sroi.sections.update', [$fixture['project'], $form, $section]), [
        'title' => 'Outcome Custom',
        'order_no' => 3,
    ])->assertRedirect();

    $this->actingAs($fixture['user'])->patch(route('projects.sroi.questions.update', [$fixture['project'], $form, $question]), [
        'section_id' => $section->id,
        'question_text' => 'Pertanyaan custom',
        'answer_type' => 'text',
        'is_active' => false,
    ])->assertRedirect();

    expect($section->fresh()->title)->toBe('Outcome Custom')
        ->and($question->fresh()->question_text)->toBe('Pertanyaan custom')
        ->and($question->fresh()->is_active)->toBeFalse();
});

it('archives other active SROI forms when activating a form', function () {
    $fixture = createSroiProjectFixture();
    $project = $fixture['project'];

    $firstForm = ProjectSroiForm::create([
        'company_id' => $fixture['company']->id,
        'project_id' => $project->id,
        'name' => 'Form Lama',
        'version' => 1,
        'status' => 'active',
        'created_by' => $fixture['user']->id,
        'activated_at' => now(),
    ]);

    $secondForm = ProjectSroiForm::create([
        'company_id' => $fixture['company']->id,
        'project_id' => $project->id,
        'name' => 'Form Baru',
        'version' => 2,
        'status' => 'draft',
        'created_by' => $fixture['user']->id,
    ]);

    $this->actingAs($fixture['user'])->patch(route('projects.sroi.forms.update', [$project, $secondForm]), [
        'status' => 'active',
    ])->assertRedirect();

    expect($firstForm->fresh()->status)->toBe('archived')
        ->and($secondForm->fresh()->status)->toBe('active')
        ->and($secondForm->fresh()->activated_at)->not->toBeNull();
});

it('shows the SROI form preview page with active questions only', function () {
    $fixture = createSroiProjectFixture();
    $this->actingAs($fixture['user'])->post(route('projects.sroi.forms.store', $fixture['project']), [
        'template_id' => $fixture['template']->id,
    ]);

    $form = ProjectSroiForm::firstOrFail();
    $section = $form->sections()->firstOrFail();
    ProjectSroiQuestion::create([
        'form_id' => $form->id,
        'section_id' => $section->id,
        'question_text' => 'Pertanyaan nonaktif',
        'answer_type' => 'text',
        'is_active' => false,
    ]);

    $response = $this->actingAs($fixture['user'])->get(route('projects.sroi.forms.preview', [$fixture['project'], $form]));

    $response
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Project/PreviewSROIForms')
            ->where('project.name', 'Program SROI')
            ->where('form.name', 'Template SROI Dasar')
            ->has('sections', 1)
            ->has('sections.0.questions', 2)
            ->where('sections.0.questions.0.questionText', 'Peningkatan Pendapatan')
            ->where('sections.0.questions.1.questionText', 'Pendapatan setelah program')
        );
});

it('prevents another company from opening a project SROI preview', function () {
    $fixture = createSroiProjectFixture();
    $this->actingAs($fixture['user'])->post(route('projects.sroi.forms.store', $fixture['project']), [
        'template_id' => $fixture['template']->id,
    ]);
    $form = ProjectSroiForm::firstOrFail();

    $otherCompany = Company::create(['name' => 'PT Preview Lain']);
    $otherUser = User::factory()->create([
        'company_id' => $otherCompany->id,
        'role' => 'company',
    ]);

    $this->actingAs($otherUser)
        ->get(route('projects.sroi.forms.preview', [$fixture['project'], $form]))
        ->assertNotFound();
});

it('returns not found when preview form does not belong to the project', function () {
    $fixture = createSroiProjectFixture();
    $otherProject = Project::create([
        'company_id' => $fixture['company']->id,
        'name' => 'Project Lain',
        'project_code' => 'SROI-02',
        'status' => 'draft',
        'enable_sroi' => true,
        'created_by' => $fixture['user']->id,
    ]);

    $form = ProjectSroiForm::create([
        'company_id' => $fixture['company']->id,
        'project_id' => $otherProject->id,
        'name' => 'Form Project Lain',
        'version' => 1,
        'status' => 'draft',
        'created_by' => $fixture['user']->id,
    ]);

    $this->actingAs($fixture['user'])
        ->get(route('projects.sroi.forms.preview', [$fixture['project'], $form]))
        ->assertNotFound();
});
