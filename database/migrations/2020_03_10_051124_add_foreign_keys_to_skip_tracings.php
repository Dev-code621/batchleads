<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToSkipTracings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('skip_tracings', function (Blueprint $table) {
            DB::statement("ALTER TABLE `skip_tracings` CHANGE `property_id` `property_id` BIGINT(20) UNSIGNED NOT NULL");
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('skip_tracings', function (Blueprint $table) {
            //
        });
    }
}
