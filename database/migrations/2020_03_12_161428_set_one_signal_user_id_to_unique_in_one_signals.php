<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SetOneSignalUserIdToUniqueInOneSignals extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('one_signals', function (Blueprint $table) {
            $table->unique('one_signal_user_id', 'one_signal_user_id_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('one_signals', function (Blueprint $table) {
            //
        });
    }
}
