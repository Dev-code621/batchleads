<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUserIdForeignToSmsMasters extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sms_masters', function (Blueprint $table) {
            DB::statement("ALTER TABLE `sms_masters` CHANGE `user_id` `user_id` BIGINT(20) UNSIGNED NOT NULL");
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
        Schema::table('sms_masters', function (Blueprint $table) {
            //
        });
    }
}
