<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        if ($request->user()->role == 'enumerator') {
            return redirect()->intended(route('enumerator.list-survey', absolute: false));
        }

        if ($request->user()->role == 'company') {
            return redirect()->intended(route('projects', absolute: false));
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Display the enumerator login view.
     */
    public function createEnum(): Response
    {
        return Inertia::render('Auth/LoginEnum', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request for enumerator.
     */
    public function storeEnum(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        if ($request->user()->role !== 'enumerator') {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => 'Akses ditolak. Hanya enumerator yang dapat masuk melalui halaman ini.',
            ]);
        }

        // Mark this session as an enumerator login so logout can redirect back
        $request->session()->put('login_enum', true);

        // Extend session lifetime for enumerator logins to 30 days (minutes)
        config(['session.lifetime' => 60 * 24 * 30]);

        // Ensure a long-lived "remember me" cookie is set
        Auth::login($request->user(), true);

        $request->session()->regenerate();

        return redirect()->intended(route('enumerator.list-survey', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Check whether this session originated from the enumerator login
        $isEnumLogin = $request->session()->pull('login_enum', false);

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        // Redirect enumerator logouts back to the enumerator login page
        if ($isEnumLogin) {
            return redirect()->guest(route('login.enum', absolute: false));
        }

        return redirect('/');
    }
}
