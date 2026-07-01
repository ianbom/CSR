<?php

use App\Models\Company;
use App\Models\Project;
use App\Models\ProjectStakeholder;
use App\Models\StakeholderOutcome;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function createProjectStakeholderFixture(): array
{
    $company = Company::create(['name' => 'PT CSR']);
    $user = User::factory()->create([
        'company_id' => $company->id,
        'role' => 'company',
    ]);

    $project = Project::create([
        'company_id' => $company->id,
        'name' => 'Program Sosial',
        'project_code' => 'CSR001',
        'status' => 'draft',
        'created_by' => $user->id,
    ]);

    return compact('company', 'user', 'project');
}

it('shows stakeholders and outcomes on project overview payload', function () {
    $fixture = createProjectStakeholderFixture();
    $stakeholder = ProjectStakeholder::create([
        'project_id' => $fixture['project']->id,
        'name' => 'Penerima Manfaat',
    ]);

    StakeholderOutcome::create([
        'stakeholder_id' => $stakeholder->id,
        'outcome' => 'Pendapatan meningkat',
    ]);

    $this->actingAs($fixture['user'])
        ->get(route('projects.show', ['id' => $fixture['project']->id, 'detailType' => 'overview']))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Project/DetailProject')
            ->where('project.stakeholders.0.name', 'Penerima Manfaat')
            ->where('project.stakeholders.0.outcomes.0.outcome', 'Pendapatan meningkat')
        );
});

it('creates updates and deletes stakeholders', function () {
    $fixture = createProjectStakeholderFixture();

    $this->actingAs($fixture['user'])
        ->post(route('projects.stakeholders.store', ['id' => $fixture['project']->id]), [
            'name' => 'Masyarakat Sekitar',
        ])
        ->assertRedirect();

    $stakeholder = ProjectStakeholder::firstOrFail();

    expect($stakeholder->name)->toBe('Masyarakat Sekitar');

    $this->actingAs($fixture['user'])
        ->patch(route('projects.stakeholders.update', ['id' => $fixture['project']->id, 'stakeholder' => $stakeholder->id]), [
            'name' => 'Masyarakat Desa',
        ])
        ->assertRedirect();

    expect($stakeholder->fresh()->name)->toBe('Masyarakat Desa');

    $this->actingAs($fixture['user'])
        ->delete(route('projects.stakeholders.destroy', ['id' => $fixture['project']->id, 'stakeholder' => $stakeholder->id]))
        ->assertRedirect();

    expect(ProjectStakeholder::count())->toBe(0);
});

it('creates updates and deletes stakeholder outcomes', function () {
    $fixture = createProjectStakeholderFixture();
    $stakeholder = ProjectStakeholder::create([
        'project_id' => $fixture['project']->id,
        'name' => 'UMKM',
    ]);

    $this->actingAs($fixture['user'])
        ->post(route('projects.stakeholder-outcomes.store', ['id' => $fixture['project']->id]), [
            'stakeholder_id' => $stakeholder->id,
            'outcome' => 'Omzet bertambah',
        ])
        ->assertRedirect();

    $outcome = StakeholderOutcome::firstOrFail();

    expect($outcome->outcome)->toBe('Omzet bertambah');

    $this->actingAs($fixture['user'])
        ->patch(route('projects.stakeholder-outcomes.update', ['id' => $fixture['project']->id, 'outcome' => $outcome->id]), [
            'outcome' => 'Omzet usaha bertambah',
        ])
        ->assertRedirect();

    expect($outcome->fresh()->outcome)->toBe('Omzet usaha bertambah');

    $this->actingAs($fixture['user'])
        ->delete(route('projects.stakeholder-outcomes.destroy', ['id' => $fixture['project']->id, 'outcome' => $outcome->id]))
        ->assertRedirect();

    expect(StakeholderOutcome::count())->toBe(0);
});

it('prevents another company from mutating stakeholder data', function () {
    $fixture = createProjectStakeholderFixture();
    $stakeholder = ProjectStakeholder::create([
        'project_id' => $fixture['project']->id,
        'name' => 'Petani',
    ]);

    $outcome = StakeholderOutcome::create([
        'stakeholder_id' => $stakeholder->id,
        'outcome' => 'Produktivitas naik',
    ]);

    $otherCompany = Company::create(['name' => 'PT Lain']);
    $otherUser = User::factory()->create([
        'company_id' => $otherCompany->id,
        'role' => 'company',
    ]);

    $this->actingAs($otherUser)
        ->patch(route('projects.stakeholders.update', ['id' => $fixture['project']->id, 'stakeholder' => $stakeholder->id]), [
            'name' => 'Tidak Boleh',
        ])
        ->assertNotFound();

    $this->actingAs($otherUser)
        ->patch(route('projects.stakeholder-outcomes.update', ['id' => $fixture['project']->id, 'outcome' => $outcome->id]), [
            'outcome' => 'Tidak Boleh',
        ])
        ->assertNotFound();
});

it('deletes outcomes when deleting a stakeholder', function () {
    $fixture = createProjectStakeholderFixture();
    $stakeholder = ProjectStakeholder::create([
        'project_id' => $fixture['project']->id,
        'name' => 'Nelayan',
    ]);

    StakeholderOutcome::create([
        'stakeholder_id' => $stakeholder->id,
        'outcome' => 'Akses pasar membaik',
    ]);

    $this->actingAs($fixture['user'])
        ->delete(route('projects.stakeholders.destroy', ['id' => $fixture['project']->id, 'stakeholder' => $stakeholder->id]))
        ->assertRedirect();

    expect(ProjectStakeholder::count())->toBe(0)
        ->and(StakeholderOutcome::count())->toBe(0);
});
