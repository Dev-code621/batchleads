<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUserTeamIdForeignKeysToDrivingRoutes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('driving_routes', function (Blueprint $table) {
            DB::statement("ALTER TABLE `driving_routes` CHANGE `team_id` `team_id` BIGINT(20) UNSIGNED NOT NULL");
            DB::statement("ALTER TABLE `driving_routes` CHANGE `user_id` `user_id` BIGINT(20) UNSIGNED NOT NULL");
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('driving_routes', function (Blueprint $table) {
            //
        });
    }
}
