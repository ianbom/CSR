<?php

use App\Models\Company;
use App\Models\Project;
use App\Models\ProjectSroiForm;
use App\Models\ProjectSroiQuestion;
use App\Models\ProjectSroiSection;
use App\Models\ProjectStakeholder;
use App\Models\Respondent;
use App\Models\Submission;
use App\Models\SubmissionSroiAnswer;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function createEnumeratorSroiSurveyFixture(): array
{
    $company = Company::create(['name' => 'PT Enumerator SROI']);
    $enumerator = User::factory()->create([
        'company_id' => $company->id,
        'role' => 'enumerator',
    ]);

    $project = Project::create([
        'company_id' => $company->id,
        'name' => 'Program SROI Enumerator',
        'project_code' => 'ENUM-SROI',
        'status' => 'active',
        'enable_sroi' => true,
        'created_by' => $enumerator->id,
    ]);

    $stakeholder = ProjectStakeholder::create([
        'project_id' => $project->id,
        'name' => 'Penerima Manfaat',
    ]);

    $form = ProjectSroiForm::create([
        'company_id' => $company->id,
        'project_id' => $project->id,
        'name' => 'Form SROI Aktif',
        'status' => 'active',
        'created_by' => $enumerator->id,
        'activated_at' => now(),
    ]);

    $section = ProjectSroiSection::create([
        'form_id' => $form->id,
        'title' => 'Outcome',
    ]);

    $question = ProjectSroiQuestion::create([
        'form_id' => $form->id,
        'section_id' => $section->id,
        'question_text' => 'Pendapatan setelah program',
        'answer_type' => 'number',
        'is_active' => true,
    ]);

    return compact('company', 'enumerator', 'project', 'stakeholder', 'form', 'section', 'question');
}

it('requires stakeholder for SROI survey submissions', function () {
    Storage::fake('public');
    $fixture = createEnumeratorSroiSurveyFixture();

    $response = $this->actingAs($fixture['enumerator'])->post(route('enumerator.survey.store', $fixture['project']), [
        'respondent' => [
            'name' => 'Responden SROI',
        ],
        'submission' => [
            'photo' => UploadedFile::fake()->image('photo.jpg'),
            'latitude' => -6.2,
            'longitude' => 106.8,
        ],
        'assessment_type' => 'SROI',
        'sroi_answers' => [
            [
                'project_sroi_question_id' => $fixture['question']->id,
                'value_number' => 1500000,
            ],
        ],
    ]);

    $response->assertSessionHasErrors('respondent.stakeholder_id');
});

it('stores SROI respondent stakeholder and project answers', function () {
    Storage::fake('public');
    $fixture = createEnumeratorSroiSurveyFixture();

    $response = $this->actingAs($fixture['enumerator'])->post(route('enumerator.survey.store', $fixture['project']), [
        'respondent' => [
            'name' => 'Responden SROI',
            'stakeholder_id' => $fixture['stakeholder']->id,
            'phone' => '08123456789',
        ],
        'submission' => [
            'photo' => UploadedFile::fake()->image('photo.jpg'),
            'latitude' => -6.2,
            'longitude' => 106.8,
        ],
        'assessment_type' => 'SROI',
        'sroi_answers' => [
            [
                'project_sroi_question_id' => $fixture['question']->id,
                'value_number' => 1500000,
            ],
        ],
    ]);

    $response->assertRedirect(route('enumerator.list-survey'));

    $respondent = Respondent::firstOrFail();
    $submission = Submission::firstOrFail();
    $answer = SubmissionSroiAnswer::firstOrFail();

    expect($respondent->stakeholder_id)->toBe($fixture['stakeholder']->id)
        ->and($submission->assessment_type)->toBe('SROI')
        ->and($submission->project_sroi_form_id)->toBe($fixture['form']->id)
        ->and($answer->project_sroi_question_id)->toBe($fixture['question']->id)
        ->and((float) $answer->value_number)->toBe(1500000.0);
});

it('shows SROI submissions on the SROI respondent tab', function () {
    Storage::fake('public');
    $fixture = createEnumeratorSroiSurveyFixture();
    $companyUser = User::factory()->create([
        'company_id' => $fixture['company']->id,
        'role' => 'company',
    ]);

    $respondent = Respondent::create([
        'company_id' => $fixture['company']->id,
        'project_id' => $fixture['project']->id,
        'stakeholder_id' => $fixture['stakeholder']->id,
        'name' => 'Responden SROI',
    ]);

    $submission = Submission::create([
        'company_id' => $fixture['company']->id,
        'project_id' => $fixture['project']->id,
        'assessment_type' => 'SROI',
        'respondent_id' => $respondent->id,
        'enumerator_id' => $fixture['enumerator']->id,
        'project_sroi_form_id' => $fixture['form']->id,
        'status' => 'submitted',
        'photo_path' => 'submissions/photo.jpg',
        'photo_mime' => 'image/jpeg',
        'photo_size_bytes' => 1024,
        'latitude' => -6.2,
        'longitude' => 106.8,
        'submitted_at' => now(),
    ]);

    SubmissionSroiAnswer::create([
        'submission_id' => $submission->id,
        'project_sroi_question_id' => $fixture['question']->id,
        'value_number' => 1500000,
    ]);

    $this->actingAs($companyUser)
        ->get(route('projects.show', ['id' => $fixture['project']->id, 'detailType' => 'sroi_respondent']))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Project/DetailProject')
            ->where('detailType', 'sroi_respondent')
            ->where('respondents.questions.0.id', $fixture['question']->id)
            ->where('respondents.rows.0.respondent.stakeholder.name', 'Penerima Manfaat')
            ->where('respondents.rows.0.answers.'.$fixture['question']->id.'.value_number', 1500000)
        );
});

it('shows the SROI answer page for a submission', function () {
    Storage::fake('public');
    $fixture = createEnumeratorSroiSurveyFixture();
    $companyUser = User::factory()->create([
        'company_id' => $fixture['company']->id,
        'role' => 'company',
    ]);

    $respondent = Respondent::create([
        'company_id' => $fixture['company']->id,
        'project_id' => $fixture['project']->id,
        'stakeholder_id' => $fixture['stakeholder']->id,
        'name' => 'Responden SROI',
    ]);

    $submission = Submission::create([
        'company_id' => $fixture['company']->id,
        'project_id' => $fixture['project']->id,
        'assessment_type' => 'SROI',
        'respondent_id' => $respondent->id,
        'enumerator_id' => $fixture['enumerator']->id,
        'project_sroi_form_id' => $fixture['form']->id,
        'status' => 'submitted',
        'photo_path' => 'submissions/photo.jpg',
        'photo_mime' => 'image/jpeg',
        'photo_size_bytes' => 1024,
        'latitude' => -6.2,
        'longitude' => 106.8,
        'submitted_at' => now(),
    ]);

    SubmissionSroiAnswer::create([
        'submission_id' => $submission->id,
        'project_sroi_question_id' => $fixture['question']->id,
        'value_number' => 1500000,
    ]);

    $this->actingAs($companyUser)
        ->get(route('projects.sroi.answers.show', [$fixture['project'], $submission]))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Project/SROIAnswerPage')
            ->where('submission.respondentName', 'Responden SROI')
            ->where('submission.stakeholderName', 'Penerima Manfaat')
            ->where('answers.'.$fixture['question']->id, '1500000.00')
        );
});

function createExistingEnumeratorSroiSubmission(array $fixture): array
{
    $respondent = Respondent::create([
        'company_id' => $fixture['company']->id,
        'project_id' => $fixture['project']->id,
        'stakeholder_id' => $fixture['stakeholder']->id,
        'name' => 'Responden Edit SROI',
        'phone' => '081111111111',
    ]);

    $submission = Submission::create([
        'company_id' => $fixture['company']->id,
        'project_id' => $fixture['project']->id,
        'assessment_type' => 'SROI',
        'respondent_id' => $respondent->id,
        'enumerator_id' => $fixture['enumerator']->id,
        'project_sroi_form_id' => $fixture['form']->id,
        'status' => 'submitted',
        'photo_path' => 'submissions/photo.jpg',
        'photo_mime' => 'image/jpeg',
        'photo_size_bytes' => 1024,
        'latitude' => -6.2,
        'longitude' => 106.8,
        'submitted_at' => now(),
    ]);

    $answer = SubmissionSroiAnswer::create([
        'submission_id' => $submission->id,
        'project_sroi_question_id' => $fixture['question']->id,
        'value_number' => 1500000,
    ]);

    return compact('respondent', 'submission', 'answer');
}

it('loads SROI form data on edit survey page', function () {
    $fixture = createEnumeratorSroiSurveyFixture();
    $existing = createExistingEnumeratorSroiSubmission($fixture);

    $this->actingAs($fixture['enumerator'])
        ->get(route('enumerator.survey.edit', $existing['submission']))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Enumerator/Survey/EditSurvey')
            ->where('projectSroiForm.name', 'Form SROI Aktif')
            ->where('projectStakeholders.0.name', 'Penerima Manfaat')
            ->where('sroiAnswersMap.'.$fixture['question']->id, '1500000.00')
        );
});

it('updates SROI respondent stakeholder and answers', function () {
    $fixture = createEnumeratorSroiSurveyFixture();
    $existing = createExistingEnumeratorSroiSubmission($fixture);
    $newStakeholder = ProjectStakeholder::create([
        'project_id' => $fixture['project']->id,
        'name' => 'Pelaku UMKM',
    ]);

    $response = $this->actingAs($fixture['enumerator'])->put(route('enumerator.survey.update', $existing['submission']), [
        'respondent' => [
            'name' => 'Responden Edit SROI',
            'stakeholder_id' => $newStakeholder->id,
            'phone' => '081111111111',
        ],
        'submission' => [
            'latitude' => -6.21,
            'longitude' => 106.81,
        ],
        'assessment_type' => 'SROI',
        'sroi_answers' => [
            [
                'project_sroi_question_id' => $fixture['question']->id,
                'value_number' => 2750000,
            ],
        ],
    ]);

    $response->assertRedirect(route('enumerator.survey.history'));

    $existing['respondent']->refresh();
    $existing['submission']->refresh();
    $activeAnswers = SubmissionSroiAnswer::query()
        ->where('submission_id', $existing['submission']->id)
        ->get();

    expect($existing['respondent']->stakeholder_id)->toBe($newStakeholder->id)
        ->and($existing['submission']->project_sroi_form_id)->toBe($fixture['form']->id)
        ->and($activeAnswers)->toHaveCount(1)
        ->and((float) $activeAnswers->first()->value_number)->toBe(2750000.0)
        ->and(SubmissionSroiAnswer::withTrashed()->where('submission_id', $existing['submission']->id)->count())->toBe(2);
});

it('requires stakeholder when updating SROI survey', function () {
    $fixture = createEnumeratorSroiSurveyFixture();
    $existing = createExistingEnumeratorSroiSubmission($fixture);

    $this->actingAs($fixture['enumerator'])->put(route('enumerator.survey.update', $existing['submission']), [
        'respondent' => [
            'name' => 'Responden Edit SROI',
            'stakeholder_id' => '',
        ],
        'submission' => [
            'latitude' => -6.21,
            'longitude' => 106.81,
        ],
        'assessment_type' => 'SROI',
        'sroi_answers' => [
            [
                'project_sroi_question_id' => $fixture['question']->id,
                'value_number' => 2750000,
            ],
        ],
    ])->assertSessionHasErrors('respondent.stakeholder_id');
});
