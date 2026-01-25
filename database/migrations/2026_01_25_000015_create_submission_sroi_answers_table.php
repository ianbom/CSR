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
            $table->foreignId('sroi_question_id')->constrained('sroi_questions')->cascadeOnDelete();
            $table->integer('value_number')->nullable();
            $table->text('value_text')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['submission_id', 'sroi_question_id']);
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
