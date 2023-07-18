<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateIdFieldsTypeInSmsCampaignTemplateDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sms_campaign_template_details', function (Blueprint $table) {
            DB::statement("ALTER TABLE `sms_campaign_template_details` CHANGE `id` `id` BIGINT(20) UNSIGNED NOT NULL");
            DB::statement("ALTER TABLE `sms_campaign_template_details` CHANGE `template_master_id` `template_master_id` BIGINT(20) UNSIGNED NOT NULL");
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
