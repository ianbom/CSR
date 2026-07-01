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
        Schema::create('submission_sroi_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('submissions')->cascadeOnDelete();
            $table->foreignId('project_sroi_question_id')->constrained('project_sroi_questions')->cascadeOnDelete();
            $table->text('value_text')->nullable();
            $table->decimal('value_number', 18, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['submission_id', 'project_sroi_question_id', 'deleted_at'], 'sub_sroi_answer_unique');
            $table->index('project_sroi_question_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_sroi_answers');
    }
};
