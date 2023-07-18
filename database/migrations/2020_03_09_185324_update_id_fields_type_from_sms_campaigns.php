<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateIdFieldsTypeFromSmsCampaigns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sms_campaigns', function (Blueprint $table) {
            DB::statement("ALTER TABLE `sms_campaigns` CHANGE `id` `id` BIGINT(20) UNSIGNED NOT NULL");
            DB::statement("ALTER TABLE `sms_campaigns` CHANGE `user_id` `user_id` BIGINT(20) UNSIGNED NOT NULL");
            DB::statement("ALTER TABLE `sms_campaigns` CHANGE `sms_campaign_template_master_id` `sms_campaign_template_master_id` BIGINT(20) UNSIGNED NOT NULL");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sms_campaigns', function (Blueprint $table) {
            //
        });
    }
}
