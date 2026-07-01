<?php

use App\Models\Company;
use App\Models\Project;
use App\Models\ProjectSroiForm;
use App\Models\ProjectSroiQuestion;
use App\Models\ProjectSroiSection;
use App\Models\ProjectStakeholder;
use App\Models\SroiTemplate;
use App\Models\SroiTemplateQuestion;
use App\Models\SroiTemplateSection;
use App\Models\StakeholderOutcome;
use App\Models\Submission;
use App\Models\SubmissionSroiAnswer;
use App\Models\User;
use Illuminate\Support\Facades\Schema;

it('creates the SROI template and project form schema from dbml', function () {
    foreach ([
        'sroi_templates',
        'sroi_template_sections',
        'sroi_template_questions',
        'project_sroi_forms',
        'project_sroi_sections',
        'project_sroi_questions',
        'project_stakeholders',
        'stakeholder_outcomes',
    ] as $table) {
        expect(Schema::hasTable($table))->toBeTrue();
    }

    expect(Schema::hasColumn('submissions', 'project_sroi_form_id'))->toBeTrue()
        ->and(Schema::hasColumn('submission_sroi_answers', 'project_sroi_question_id'))->toBeTrue()
        ->and(Schema::hasColumn('respondents', 'stakeholder_id'))->toBeTrue()
        ->and(Schema::hasColumn('submission_sroi_answers', 'sroi_question_id'))->toBeFalse()
        ->and(Schema::hasTable('sroi_questions'))->toBeFalse();
});

it('persists SROI template, project form, question, and answer relationships', function () {
    $company = Company::create(['name' => 'Acme CSR']);
    $creator = User::factory()->create(['company_id' => $company->id]);

    $project = Project::create([
        'company_id' => $company->id,
        'name' => 'Water Access Program',
        'project_code' => 'WATER1',
        'enable_sroi' => true,
        'created_by' => $creator->id,
    ]);

    $template = SroiTemplate::create([
        'name' => 'SROI Basic',
        'created_by' => $creator->id,
    ]);

    $templateSection = SroiTemplateSection::create([
        'template_id' => $template->id,
        'title' => 'Inputs',
    ]);

    $templateQuestion = SroiTemplateQuestion::create([
        'template_id' => $template->id,
        'section_id' => $templateSection->id,
        'question_text' => 'How much value was created?',
        'answer_type' => 'number',
    ]);

    $form = ProjectSroiForm::create([
        'company_id' => $company->id,
        'project_id' => $project->id,
        'source_template_id' => $template->id,
        'name' => 'Water Access SROI',
        'created_by' => $creator->id,
    ]);

    $section = ProjectSroiSection::create([
        'form_id' => $form->id,
        'source_template_section_id' => $templateSection->id,
        'title' => 'Inputs',
    ]);

    $question = ProjectSroiQuestion::create([
        'form_id' => $form->id,
        'section_id' => $section->id,
        'source_template_question_id' => $templateQuestion->id,
        'question_text' => 'How much value was created?',
        'answer_type' => 'number',
    ]);

    $respondent = $project->respondents()->create([
        'company_id' => $company->id,
        'name' => 'Respondent One',
    ]);

    $stakeholder = ProjectStakeholder::create([
        'project_id' => $project->id,
        'name' => 'Beneficiaries',
    ]);

    $outcome = StakeholderOutcome::create([
        'stakeholder_id' => $stakeholder->id,
        'outcome' => 'Higher monthly income',
    ]);

    $respondent->update([
        'stakeholder_id' => $stakeholder->id,
    ]);

    $submission = Submission::create([
        'company_id' => $company->id,
        'project_id' => $project->id,
        'assessment_type' => 'SROI',
        'respondent_id' => $respondent->id,
        'enumerator_id' => $creator->id,
        'project_sroi_form_id' => $form->id,
        'photo_path' => 'submissions/photo.jpg',
        'latitude' => -6.2,
        'longitude' => 106.8,
    ]);

    $answer = SubmissionSroiAnswer::create([
        'submission_id' => $submission->id,
        'project_sroi_question_id' => $question->id,
        'value_number' => 1250000.50,
    ]);

    expect($template->sections)->toHaveCount(1)
        ->and($templateQuestion->section->is($templateSection))->toBeTrue()
        ->and($form->project->is($project))->toBeTrue()
        ->and($form->questions)->toHaveCount(1)
        ->and($project->stakeholders)->toHaveCount(1)
        ->and($stakeholder->project->is($project))->toBeTrue()
        ->and($stakeholder->outcomes)->toHaveCount(1)
        ->and($outcome->stakeholder->is($stakeholder))->toBeTrue()
        ->and($respondent->stakeholder->is($stakeholder))->toBeTrue()
        ->and($question->sourceTemplateQuestion->is($templateQuestion))->toBeTrue()
        ->and($submission->projectSroiForm->is($form))->toBeTrue()
        ->and($answer->projectSroiQuestion->is($question))->toBeTrue();
});
