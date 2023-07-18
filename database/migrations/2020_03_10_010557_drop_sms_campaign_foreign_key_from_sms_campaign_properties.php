<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropSmsCampaignForeignKeyFromSmsCampaignProperties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sms_campaign_properties', function (Blueprint $table) {
            $table->dropForeign('sms_campaign_properties_sms_campaign_id_foreign');
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
