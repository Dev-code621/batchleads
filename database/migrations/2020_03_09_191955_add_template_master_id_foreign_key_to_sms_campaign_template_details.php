<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTemplateMasterIdForeignKeyToSmsCampaignTemplateDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sms_campaign_template_details', function (Blueprint $table) {
            $table->foreign('template_master_id')->references('id')->on('sms_campaign_template_masters')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sms_campaign_template_details', function (Blueprint $table) {
            //
        });
    }
}
