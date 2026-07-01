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
        Schema::create('sroi_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->integer('version')->default(1);
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['name', 'version', 'deleted_at'], 'sroi_template_name_ver_del_unique');
            $table->index('is_active');
        });

        Schema::create('sroi_template_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('sroi_templates')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('order_no')->default(1);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['template_id', 'order_no']);
        });

        Schema::create('sroi_template_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('sroi_templates')->cascadeOnDelete();
            $table->foreignId('section_id')->constrained('sroi_template_sections')->cascadeOnDelete();
            $table->foreignId('parent_question_id')->nullable()->constrained('sroi_template_questions')->nullOnDelete();
            $table->text('question_text');
            $table->text('help_text')->nullable();
            $table->string('answer_type', 10)->nullable()->comment('text|number|null. null digunakan untuk pertanyaan group/judul');
            $table->string('unit', 50)->nullable()->comment('contoh: rupiah_per_bulan, orang, persen, skala_1_10');
            $table->boolean('is_group')->default(false);
            $table->integer('order_no')->default(1);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['template_id', 'section_id', 'order_no']);
            $table->index('parent_question_id');
        });

        Schema::create('project_sroi_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('source_template_id')->nullable()->constrained('sroi_templates')->nullOnDelete();
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->integer('version')->default(1);
            $table->string('status', 20)->default('draft')->comment('draft|active|archived');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('activated_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['project_id', 'version', 'deleted_at'], 'project_sroi_form_project_ver_del_unique');
            $table->index(['company_id', 'status']);
            $table->index('source_template_id');
        });

        Schema::create('project_sroi_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained('project_sroi_forms')->cascadeOnDelete();
            $table->foreignId('source_template_section_id')->nullable()->constrained('sroi_template_sections')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('order_no')->default(1);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['form_id', 'order_no']);
            $table->index('source_template_section_id');
        });

        Schema::create('project_sroi_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained('project_sroi_forms')->cascadeOnDelete();
            $table->foreignId('section_id')->constrained('project_sroi_sections')->cascadeOnDelete();
            $table->foreignId('parent_question_id')->nullable()->constrained('project_sroi_questions')->nullOnDelete();
            $table->foreignId('source_template_question_id')->nullable()->constrained('sroi_template_questions')->nullOnDelete();
            $table->text('question_text');
            $table->text('help_text')->nullable();
            $table->string('answer_type', 10)->nullable()->comment('text|number|null. null digunakan untuk pertanyaan group/judul');
            $table->string('unit', 50)->nullable()->comment('contoh: rupiah_per_bulan, orang, persen, skala_1_10');
            $table->boolean('is_group')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('order_no')->default(1);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['form_id', 'section_id', 'order_no']);
            $table->index('parent_question_id');
            $table->index('source_template_question_id');
            $table->index('is_active');
        });

        Schema::dropIfExists('sroi_questions');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_sroi_questions');
        Schema::dropIfExists('project_sroi_sections');
        Schema::dropIfExists('project_sroi_forms');
        Schema::dropIfExists('sroi_template_questions');
        Schema::dropIfExists('sroi_template_sections');
        Schema::dropIfExists('sroi_templates');
    }
};
