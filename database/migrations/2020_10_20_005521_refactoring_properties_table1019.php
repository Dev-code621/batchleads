<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RefactoringPropertiesTable1019 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('Sale_Date')->nullable();
            $table->string('Sale_Price')->nullable();
            $table->string('Current_Est_Equity_Dollars')->nullable();
            $table->string('Mortgage_Amount')->nullable();
            $table->string('Assessed_Value')->nullable();
            $table->string('Year_Built')->nullable();
            $table->string('Square_Footage')->nullable();
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
