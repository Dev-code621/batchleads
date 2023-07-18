<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSmsCampaignIdForeignKeyToSmsCampaignProperties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sms_campaign_properties', function (Blueprint $table) {
            $table->foreign('sms_campaign_id')->references('id')->on('sms_campaigns')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sms_campaign_properties', function (Blueprint $table) {
            //
        });
    }
}
