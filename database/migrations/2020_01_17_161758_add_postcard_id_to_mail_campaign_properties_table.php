<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPostcardIdToMailCampaignPropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('mail_campaign_properties', function (Blueprint $table) {
            if(!Schema::hasColumn('mail_campaign_properties', 'postcard_id')) {
                $table->string('postcard_id');
            }
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
