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
        Schema::create('template_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('instrument_templates')->cascadeOnDelete();
            $table->string('category', 100)->nullable();
            $table->string('code', 50);
            $table->text('question_text');
            $table->integer('order_no')->default(1);
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['template_id', 'code']);
            $table->index(['template_id', 'order_no']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('template_questions');
    }
};
