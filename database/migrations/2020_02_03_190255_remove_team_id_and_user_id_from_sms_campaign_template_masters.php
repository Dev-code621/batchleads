<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveTeamIdAndUserIdFromSmsCampaignTemplateMasters extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sms_campaign_template_masters', function (Blueprint $table) {
            $table->dropColumn('user_id');
            $table->dropColumn('team_id');
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
