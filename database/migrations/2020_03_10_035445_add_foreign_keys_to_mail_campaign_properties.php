<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToMailCampaignProperties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('mail_campaign_properties', function (Blueprint $table) {
            $table->foreign('mail_campaign_id')->references('id')->on('mail_campaigns')->onDelete('cascade');
            $table->foreign('property_id')->references('id')->on('properties');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('mail_campaign_properties', function (Blueprint $table) {
            //
        });
    }
}
