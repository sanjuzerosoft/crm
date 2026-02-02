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
        Schema::create('activitydatas', function (Blueprint $table) {
            $table->id();

            $table->date('activity_date');

        $table->enum('type', ['call', 'mail', 'meeting', 'demo']);

        $table->text('description')->nullable();

        $table->enum('status', ['scheduled', 'completed', 'cancelled'])
              ->default('scheduled');

        // Foreign Keys
        $table->unsignedBigInteger('lead_id')->nullable();
        $table->unsignedBigInteger('customer_id')->nullable();
        $table->unsignedBigInteger('project_id')->nullable();

        // Relations
        $table->foreign('lead_id')->references('id')->on('lead_datas')->onDelete('set null');
        $table->foreign('customer_id')->references('id')->on('customers')->onDelete('set null');
        $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activitydatas');
    }
};
