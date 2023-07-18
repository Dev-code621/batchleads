<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMailCampaignRepeats extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mail_campaign_repeats', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('mail_campaign_id');
            $table->integer('repeat_every');
            $table->foreign('mail_campaign_id')->references('id')->on('mail_campaigns')->onDelete('cascade');
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
        Schema::dropIfExists('mail_campaign_repeats');
    }
}
