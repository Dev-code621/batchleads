<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAdditionalFields200616ToProperties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->text('Property_Type')->nullable();
            $table->text('Owner_Type')->nullable();
            $table->text('Last_Sale_Date')->nullable();
            $table->text('Number_of_Units')->nullable();
            $table->text('pool')->nullable();
            $table->text('fireplace')->nullable();
            $table->text('Air_Conditioning_Source')->nullable();
            $table->text('Air_Conditioning_Type')->nullable();
            $table->text('Construction_Type')->nullable();
            $table->text('Heating_Type')->nullable();
            $table->text('Garage_Type')->nullable();
            $table->text('Roof_Type')->nullable();
            $table->text('foundation')->nullable();
            $table->text('Number_of_Garages')->nullable();
            $table->text('property_class')->nullable();
            $table->text('zoning')->nullable();
            $table->text('Lot_Size_Acres')->nullable();
            $table->text('Legal_Description')->nullable();
            $table->text('Lot_Number')->nullable();
            $table->text('subdivision')->nullable();
            $table->text('totalMarketValue')->nullable();
            $table->text('assessmentYear')->nullable();
            $table->text('taxAmount')->nullable();
            $table->text('taxYear')->nullable();
            $table->text('assessedImprovementValue')->nullable();
            $table->text('marketValueYear')->nullable();
            $table->text('totalFinancingHistoryCount')->nullable();
            $table->text('documentType')->nullable();
            $table->text('distressedSaleFlag')->nullable();
            $table->text('recordingDate')->nullable();
            $table->text('age')->nullable();
            $table->text('householdSize')->nullable();
            $table->text('income')->nullable();
            $table->text('netWorth')->nullable();
            $table->text('discretionaryIncome')->nullable();
            $table->text('businessOwner')->nullable();
            $table->text('gender')->nullable();
            $table->text('hasChildren')->nullable();
            $table->text('investmentRealEstate')->nullable();
            $table->text('maritalStatus')->nullable();
            $table->text('petOwner')->nullable();
            $table->text('singleParent')->nullable();
            $table->text('smoker')->nullable();
            $table->text('vehiclesOwned')->nullable();
            $table->text('religiousAffiliation')->nullable();
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
