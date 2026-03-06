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
        Schema::create('submission_timelines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('submissions')->cascadeOnDelete();

            $table->string('action', 20)->comment('submitted|approved|rejected|revised');
            $table->timestamp('decided_at')->useCurrent();
            $table->foreignId('decided_by')->constrained('users')->cascadeOnDelete();
            $table->text('notes')->nullable();

            $table->timestamp('created_at')->useCurrent();

            $table->index(['submission_id', 'decided_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_timelines');
    }
};
