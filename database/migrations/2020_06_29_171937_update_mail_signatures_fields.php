<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateMailSignaturesFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('mail_signatures', function (Blueprint $table) {
            $table->string('address_line1')->nullable()->change();
            $table->string('address_line2')->nullable()->change();
            $table->string('address_city')->nullable()->change();
            $table->string('address_state')->nullable()->change();
            $table->string('address_zip')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('mail_signatures', function (Blueprint $table) {
            //
        });
    }
}
