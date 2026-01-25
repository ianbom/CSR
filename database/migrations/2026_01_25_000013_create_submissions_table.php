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
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('assessment_type', 10)->comment('IKM|SLOI|SROI');

            $table->foreignId('respondent_id')->nullable()->constrained('respondents')->nullOnDelete()->comment('one to one');
            $table->foreignId('enumerator_id')->constrained('users')->cascadeOnDelete();

            $table->string('status', 20)->default('submitted')->comment('submitted|approved|rejected');

            // foto bukti (selfie enumerator + warga)
            $table->text('photo_path')->comment('path/url foto');
            $table->string('photo_mime', 100)->nullable();
            $table->bigInteger('photo_size_bytes')->nullable();

            // lokasi cukup link maps
            $table->text('maps_url')->comment('contoh: https://www.google.com/maps?q=-7.25,112.75');

            $table->timestamp('submitted_at')->useCurrent();

            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_note')->nullable();

            $table->timestamp('created_at')->useCurrent();

            $table->index(['company_id', 'project_id', 'assessment_type', 'submitted_at'], 'submissions_company_project_type_submitted_idx');
            $table->index(['project_id', 'enumerator_id', 'submitted_at']);
            $table->index(['project_id', 'respondent_id']);
            $table->unique(['project_id', 'respondent_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
