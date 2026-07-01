<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Superseded by the ordered migration used for fresh installs.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op: the real table is managed by the ordered migration.
    }
};
