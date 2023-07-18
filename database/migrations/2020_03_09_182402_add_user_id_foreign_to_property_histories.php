<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUserIdForeignToPropertyHistories extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('property_histories', function (Blueprint $table) {
            DB::statement("ALTER TABLE `property_histories` CHANGE `user_id` `user_id` BIGINT(20) UNSIGNED NOT NULL");
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
        Schema::table('property_histories', function (Blueprint $table) {
            //
        });
    }
}
