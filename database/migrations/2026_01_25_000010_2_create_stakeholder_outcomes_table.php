<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stakeholder_outcomes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stakeholder_id')->constrained('project_stakeholders')->cascadeOnDelete();
            $table->text('outcome');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stakeholder_outcomes');
    }
};
