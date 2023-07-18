<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateIdFieldsTypeInSmsCampaignTemplateMasters extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sms_campaign_template_masters', function (Blueprint $table) {
            DB::statement("ALTER TABLE `sms_campaign_template_masters` CHANGE `id` `id` BIGINT(20) UNSIGNED NOT NULL");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sms_campaign_template_masters', function (Blueprint $table) {
            //
        });
    }
}
