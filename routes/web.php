<?php

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

// Company Routes
Route::prefix('company')->name('company.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Company/Dashboard');
    })->name('dashboard');

    // Projects
    Route::get('/projects', function () {
        return Inertia::render('Company/Project/ListProject');
    })->name('projects.index');

    Route::get('/projects/create', function () {
        return Inertia::render('Company/Project/CreateProject');
    })->name('projects.create');

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

