<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSmsCampaignIdToSmsMessageReceivedPhoneNumbers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sms_message_received_phone_numbers', function (Blueprint $table) {
            $table->dropColumn('twilio_messaging_service_id');
            $table->unsignedBigInteger('sms_campaign_id');
            $table->foreign('sms_campaign_id')->references('id')->on('sms_campaigns')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sms_message_received_phone_numbers', function (Blueprint $table) {
            //
        });
    }
}
