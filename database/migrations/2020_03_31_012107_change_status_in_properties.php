<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeStatusInProperties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            DB::statement("ALTER TABLE properties CHANGE COLUMN `status` `status` ENUM('New', 'Hot Lead', 'Warm Lead', 'Not Interested', 'Followup', 'Currently Marketing', 'Appointment Set', 'Offer Sent', 'Offer Accepted', 'Deal Closed', 'Unresponsive', 'Archive') NOT NULL DEFAULT 'New'");
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
