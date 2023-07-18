<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateIconFromStatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('states', function (Blueprint $table) {
            DB::statement("ALTER TABLE states MODIFY COLUMN icon ENUM('New', 'Hot', 'Not Interested', 'Currently Marketing', 'Dead Deal', 'Danger', 'star', 'dollar', 'question', 'car', 'house', 'road')");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('states', function (Blueprint $table) {
            //
        });
    }
}
