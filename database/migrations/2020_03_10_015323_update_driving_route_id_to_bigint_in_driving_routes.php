<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateDrivingRouteIdToBigintInDrivingRoutes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('driving_routes', function (Blueprint $table) {
            DB::statement("ALTER TABLE `driving_routes` CHANGE `id` `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT");
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
