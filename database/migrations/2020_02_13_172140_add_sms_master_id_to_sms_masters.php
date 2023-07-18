<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSmsMasterIdToSmsMasters extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sms_details', function (Blueprint $table) {
            $table->unsignedBigInteger('sms_master_id');
            $table->foreign('sms_master_id')
                ->references('id')->on('sms_masters')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sms_masters', function (Blueprint $table) {
            //
        });
    }
}
