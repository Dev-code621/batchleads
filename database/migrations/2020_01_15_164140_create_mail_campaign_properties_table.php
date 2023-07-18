<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMailCampaignPropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mail_campaign_properties', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('mail_campaign_id');
            $table->integer('property_id');
            $table->enum('status', ['delivered', 'not delivered', 'canceled', 'other']);
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
        Schema::table('mail_campaign_properties', function (Blueprint $table) {
            //
        });
    }
}
