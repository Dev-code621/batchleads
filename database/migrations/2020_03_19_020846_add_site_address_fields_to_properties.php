<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSiteAddressFieldsToProperties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->text('Mailing_Zip5')->nullable();
            $table->text('Site_Address')->nullable();
            $table->text('Site_City')->nullable();
            $table->text('Site_State')->nullable();
            $table->text('Site_Zip5')->nullable();
            $table->text('Site_Zip4')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('properties', function (Blueprint $table) {
            //
        });
    }
}
