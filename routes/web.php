<?php

use App\Http\Controllers\AreaController;
use App\Http\Controllers\Company\ProjectController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('enumerator')->name('enumerator.')->group(function () {
    Route::get('/list', function () {
        return Inertia::render('Enumerator/Project/ListProject');
    })->name('list-survey');

    Route::get('/survey/respondent', function () {
        return Inertia::render('Enumerator/Survey/RespondentSurvey');
    })->name('survey.respondent');

    Route::get('/survey/questions', function () {
        return Inertia::render('Enumerator/Survey/QuestionSurvey');
    })->name('survey.questions');
});

Route::prefix('api/area')->name('api.area.')->group(function () {
    Route::get('/provinces', [AreaController::class, 'getProvinces'])->name('provinces');
    Route::get('/cities', [AreaController::class, 'getCities'])->name('cities');
    Route::get('/districts', [AreaController::class, 'getDistricts'])->name('districts');
});
Route::prefix('api/projects')->name('api.projects.')->group(function () {
    Route::get('/{id}/enumerators', [ProjectController::class, 'getProjectEnumerators'])->name('enumerators');
});

// Company Routes
Route::prefix('company')->name('company.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Company/Dashboard');
    })->name('dashboard');



    // Projects
    Route::get('/projects', [ProjectController::class, 'listProjectPage'])->name('projects');
    Route::get('/projects/create', [ProjectController::class, 'createProjectPage'])->name('projects.create');
    Route::post('/projects', [ProjectController::class, 'storeProject'])->name('projects.store');
    Route::post('/projects/{id}/assign-enumerators', [ProjectController::class, 'assignEnumerators'])->name('projects.assign-enumerators');


    Route::get('/projects/{id}', function ($id) {
        return Inertia::render('Company/Project/DetailProject', ['id' => $id]);
    })->name('projects.show');

    // Enumerators
    Route::get('/enumerators', function () {
        return Inertia::render('Company/Enumerator/ListEnumerator');
    })->name('enumerators.index');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

