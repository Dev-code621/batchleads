<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SmsCampaignLog extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sms_campaign_logs', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('sms_campaign_id');
            $table->string('message');
            $table->string('sms_id');
            $table->string('sender');
            $table->string('receiver');
            $table->boolean('direction');
            $table->enum('status', ['sent', 'read', 'delivered', 'not sent', 'other']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
