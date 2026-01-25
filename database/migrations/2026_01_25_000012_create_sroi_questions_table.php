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
        Schema::create('sroi_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('code', 50)->nullable();
            $table->text('question_text');
            $table->string('answer_type', 20)->comment('text|likert_1_5');
            $table->boolean('required')->default(true);
            $table->decimal('weight', 6, 3)->default(1.0);
            $table->integer('order_no')->default(1);
            $table->timestamps();

            $table->index(['project_id', 'order_no']);
            $table->index(['project_id', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sroi_questions');
    }
};
