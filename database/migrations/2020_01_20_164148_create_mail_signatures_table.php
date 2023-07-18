<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMailSignaturesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mail_signatures', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->string('label');
            $table->string('sign_off');
            $table->string('name');
            $table->string('contact_phone');
            $table->string('contact_email');
            $table->string('contact_website')->nullable();
            $table->string('address_line1');
            $table->string('address_line2');
            $table->string('address_city');
            $table->string('address_state');
            $table->string('address_zip');
            $table->string('disclosure_agreement')->nullable();
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
        Schema::table('mail_signatures', function (Blueprint $table) {
            //
        });
    }
}
