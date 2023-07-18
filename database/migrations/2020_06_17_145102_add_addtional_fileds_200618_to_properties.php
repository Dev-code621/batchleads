<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAddtionalFileds200618ToProperties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->text('lenderType')->nullable();
            $table->text('originalDateOfContract')->nullable();
            $table->text('typeFinancing')->nullable();
            $table->text('lenderMailingAddress_street')->nullable();
            $table->text('lenderMailingAddress_city')->nullable();
            $table->text('lenderMailingAddress_state')->nullable();
            $table->text('lenderMailingAddress_zip')->nullable();
            $table->text('lenderMailingAddress_zipPlus4')->nullable();
            $table->text('lenderMailingAddress_unitNumber')->nullable();
            $table->text('estimatedMonthlyPrincipalAndInterest')->nullable();
            $table->text('estimatedMonthlyPrincipal')->nullable();
            $table->text('estimatedMonthlyInterest')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('properties', function (Blueprint $table) {
            //
        });
    }
}
