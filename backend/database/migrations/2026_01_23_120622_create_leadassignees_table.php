<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leadassignees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();        // EMP001, SALES01
            $table->string('email')->unique();
            $table->string('mobile_number', 15);
            $table->string('role');                  // admin, sales, manager
            $table->boolean('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leadassignees');
    }
};
