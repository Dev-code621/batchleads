<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToPropertyPhones extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('property_phones', function (Blueprint $table) {
            DB::statement("ALTER TABLE `property_phones` CHANGE `property_id` `property_id` BIGINT(20) UNSIGNED NOT NULL");
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
        Schema::table('property_phones', function (Blueprint $table) {
            //
        });
    }
}
