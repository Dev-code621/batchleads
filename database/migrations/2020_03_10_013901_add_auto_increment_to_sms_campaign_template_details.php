<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAutoIncrementToSmsCampaignTemplateDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sms_campaign_template_details', function (Blueprint $table) {
            $table->bigIncrements('id')->change();
            $table->dropForeign('sms_campaign_template_details_template_master_id_foreign');
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
