<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSaleMortgageTaxPropertyInfosToProperties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->text('Sale_Date')->nullable();
            $table->text('Sale_Price')->nullable();
            $table->text('Mortgage_Amount')->nullable();
            $table->text('Lender_Name')->nullable();
            $table->text('Assessed_Value')->nullable();
            $table->text('Improvement_Value')->nullable();
            $table->text('Land_Value')->nullable();
            $table->text('Total_Value')->nullable();
            $table->text('Year_Built')->nullable();
            $table->text('Baths')->nullable();
            $table->text('Bedrooms')->nullable();
            $table->text('Square_Footage')->nullable();
            $table->text('Acreage')->nullable();
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
