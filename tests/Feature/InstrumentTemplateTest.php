<?php

use App\Models\InstrumentTemplate;
use App\Models\User;

it('can store a new instrument template with is_active always false', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/templates', [
        'type' => 'IKM',
        'name' => 'Template IKM Test',
        'version' => 1,
        'description' => 'Test description',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('instrument_templates', [
        'type' => 'IKM',
        'name' => 'Template IKM Test',
        'version' => 1,
        'is_active' => false,
        'created_by' => $user->id,
    ]);
});

it('can update an instrument template', function () {
    $user = User::factory()->create();
    $template = InstrumentTemplate::create([
        'type' => 'IKM',
        'name' => 'Original Name',
        'version' => 1,
        'is_active' => false,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)->put("/templates/{$template->id}", [
        'type' => 'IKM',
        'name' => 'Updated Name',
        'version' => 2,
        'description' => 'Updated desc',
        'is_active' => false,
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('instrument_templates', [
        'id' => $template->id,
        'name' => 'Updated Name',
        'version' => 2,
    ]);
});

it('deactivates other templates of same type when activating one', function () {
    $user = User::factory()->create();

    $activeTemplate = InstrumentTemplate::create([
        'type' => 'IKM',
        'name' => 'Active IKM',
        'version' => 1,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    $inactiveTemplate = InstrumentTemplate::create([
        'type' => 'IKM',
        'name' => 'Inactive IKM',
        'version' => 2,
        'is_active' => false,
        'created_by' => $user->id,
    ]);

    // Also create a SLOI template that should NOT be affected
    $sloiTemplate = InstrumentTemplate::create([
        'type' => 'SLOI',
        'name' => 'Active SLOI',
        'version' => 1,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)->put("/templates/{$inactiveTemplate->id}", [
        'type' => 'IKM',
        'name' => 'Inactive IKM',
        'version' => 2,
        'description' => null,
        'is_active' => true,
    ]);

    $response->assertRedirect();

    // The activated template should now be active
    $this->assertDatabaseHas('instrument_templates', [
        'id' => $inactiveTemplate->id,
        'is_active' => true,
    ]);

    // The previously active IKM template should now be inactive
    $this->assertDatabaseHas('instrument_templates', [
        'id' => $activeTemplate->id,
        'is_active' => false,
    ]);

    // The SLOI template should remain active (different type)
    $this->assertDatabaseHas('instrument_templates', [
        'id' => $sloiTemplate->id,
        'is_active' => true,
    ]);
});

it('can delete an instrument template', function () {
    $user = User::factory()->create();
    $template = InstrumentTemplate::create([
        'type' => 'SLOI',
        'name' => 'To Delete',
        'version' => 1,
        'is_active' => false,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)->delete("/templates/{$template->id}");

    $response->assertRedirect();
    $this->assertSoftDeleted('instrument_templates', ['id' => $template->id]);
});

it('validates required fields on store', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/templates', []);

    $response->assertSessionHasErrors(['type', 'name', 'version']);
});
