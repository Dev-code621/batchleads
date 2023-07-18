<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateIdFieldsTypeInSmsCampaignProperties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sms_campaign_properties', function (Blueprint $table) {
            DB::statement("ALTER TABLE `sms_campaign_properties` CHANGE `sms_campaign_id` `sms_campaign_id` BIGINT(20) UNSIGNED NOT NULL");
            DB::statement("ALTER TABLE `sms_campaign_properties` CHANGE `property_id` `property_id` BIGINT(20) UNSIGNED NOT NULL");
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
