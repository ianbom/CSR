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
        Schema::create('submission_descriptive_answers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('submission_id');
            $table->unsignedBigInteger('project_descriptive_question_id');
            $table->text('answer');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('submission_id')
                ->references('id')
                ->on('submissions')
                ->cascadeOnDelete();

            $table->foreign('project_descriptive_question_id', 'sda_pdq_fk')
                ->references('id')
                ->on('project_descriptive_questions')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_descriptive_answers');
    }
};
