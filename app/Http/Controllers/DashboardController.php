<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard(){ 
        $user = Auth::user();

        if($user->role == 'company'){
            return Inertia::render('Company/Dashboard');
        }
        if($user->role == 'enumerator'){
            return Inertia::render('Enumerator/Project/ListProject');
        }

        return Inertia::render('Company/Dashboard');
    }
}
