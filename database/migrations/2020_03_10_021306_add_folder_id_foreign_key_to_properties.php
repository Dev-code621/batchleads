<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFolderIdForeignKeyToProperties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->foreign('folder_id')->references('id')->on('folders')->onDelete('cascade');
            DB::statement("ALTER TABLE `properties` CHANGE `user_id` `user_id` BIGINT(20) UNSIGNED NOT NULL");
            DB::statement("ALTER TABLE `properties` CHANGE `team_id` `team_id` BIGINT(20) UNSIGNED NOT NULL");
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('properties', function (Blueprint $table) {
            //
        });
    }
}
