<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRouteTypeToDrivingRoutes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('driving_routes', function (Blueprint $table) {
            $table->enum('route_type', ['Physical', 'Virtual'])->default('Physical');
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
