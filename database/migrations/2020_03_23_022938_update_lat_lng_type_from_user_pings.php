<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateLatLngTypeFromUserPings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_pings', function (Blueprint $table) {
            $table->string('latitude')->nullable()->change();
            $table->string('longitude')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_pings', function (Blueprint $table) {
            //
        });
    }
}
