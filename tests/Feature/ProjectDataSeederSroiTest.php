<?php

use App\Models\City;
use App\Models\District;
use App\Models\Project;
use App\Models\ProjectSroiForm;
use App\Models\ProjectSroiQuestion;
use App\Models\ProjectSroiSection;
use App\Models\ProjectStakeholder;
use App\Models\Province;
use App\Models\Respondent;
use App\Models\SroiTemplate;
use App\Models\SroiTemplateQuestion;
use App\Models\StakeholderOutcome;
use App\Models\Submission;
use App\Models\SubmissionSroiAnswer;
use App\Models\SubmissionTemplateAnswer;
use Database\Seeders\InstrumentTemplateSeeder;
use Database\Seeders\ProjectDataSeeder;
use Database\Seeders\SroiTemplateSeeder;
use Database\Seeders\UserSeeder;

it('seeds project SROI data from the active SROI template', function () {
    $this->seed([
        UserSeeder::class,
        InstrumentTemplateSeeder::class,
        SroiTemplateSeeder::class,
    ]);
    createSeederDistrict();
    $this->seed(ProjectDataSeeder::class);

    $project = Project::where('project_code', 'PROJ-MJB001')->firstOrFail();
    $template = SroiTemplate::active()->withCount(['sections', 'questions'])->firstOrFail();
    $form = ProjectSroiForm::where('project_id', $project->id)->active()->firstOrFail();

    expect($project->enable_sroi)->toBeTrue()
        ->and($form->source_template_id)->toBe($template->id)
        ->and(ProjectSroiSection::where('form_id', $form->id)->count())->toBe($template->sections_count)
        ->and(ProjectSroiQuestion::where('form_id', $form->id)->count())->toBe($template->questions_count)
        ->and(ProjectStakeholder::where('project_id', $project->id)->count())->toBeGreaterThanOrEqual(4)
        ->and(StakeholderOutcome::whereIn('stakeholder_id', ProjectStakeholder::where('project_id', $project->id)->select('id'))->count())->toBeGreaterThan(0);

    $templateParent = SroiTemplateQuestion::whereNotNull('parent_question_id')->firstOrFail();
    $copiedParent = ProjectSroiQuestion::where('source_template_question_id', $templateParent->parent_question_id)->firstOrFail();
    $copiedChild = ProjectSroiQuestion::where('source_template_question_id', $templateParent->id)->firstOrFail();

    expect($copiedChild->parent_question_id)->toBe($copiedParent->id);
});

it('seeds SROI respondents, submissions, and project answers', function () {
    $this->seed([
        UserSeeder::class,
        InstrumentTemplateSeeder::class,
        SroiTemplateSeeder::class,
    ]);
    createSeederDistrict();
    $this->seed(ProjectDataSeeder::class);

    $project = Project::where('project_code', 'PROJ-MJB001')->firstOrFail();
    $form = ProjectSroiForm::where('project_id', $project->id)->active()->firstOrFail();
    $answerableQuestionCount = ProjectSroiQuestion::where('form_id', $form->id)
        ->where('is_group', false)
        ->whereNotNull('answer_type')
        ->count();

    $sroiSubmission = Submission::where('project_id', $project->id)
        ->where('assessment_type', 'SROI')
        ->firstOrFail();

    expect($sroiSubmission->project_sroi_form_id)->toBe($form->id)
        ->and(Respondent::where('project_id', $project->id)->whereNotNull('stakeholder_id')->count())->toBeGreaterThan(0)
        ->and(SubmissionSroiAnswer::where('submission_id', $sroiSubmission->id)->count())->toBe($answerableQuestionCount)
        ->and(SubmissionTemplateAnswer::where('submission_id', $sroiSubmission->id)->count())->toBe(0)
        ->and(SubmissionSroiAnswer::where('submission_id', $sroiSubmission->id)->whereNotNull('value_text')->exists())->toBeTrue()
        ->and(SubmissionSroiAnswer::where('submission_id', $sroiSubmission->id)->whereNotNull('value_number')->exists())->toBeTrue();
});
function createSeederDistrict(): void
{
    $province = Province::create([
        'code' => '99',
        'name' => 'Provinsi Test',
    ]);

    $city = City::create([
        'province_id' => $province->id,
        'code' => '9901',
        'name' => 'Kota Test',
        'type' => 'kota',
    ]);

    District::create([
        'city_id' => $city->id,
        'code' => '990101',
        'name' => 'Kecamatan Test',
    ]);
}
