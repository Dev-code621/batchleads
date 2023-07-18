<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTotalMailersAndFinishedToMailCampaignRepeats extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('mail_campaign_repeats', function (Blueprint $table) {
            $table->integer('total_mailers');
            $table->boolean('finished');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('mail_campaign_repeats', function (Blueprint $table) {
            //
        });
    }
}
