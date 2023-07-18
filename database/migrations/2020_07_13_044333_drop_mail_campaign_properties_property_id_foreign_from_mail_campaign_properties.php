<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropMailCampaignPropertiesPropertyIdForeignFromMailCampaignProperties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('mail_campaign_properties', function (Blueprint $table) {
            $table->dropForeign('mail_campaign_properties_property_id_foreign');
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
