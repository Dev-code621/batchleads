<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsToProperties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('Assessors_Parcel_Number')->nullable();
            $table->string('Current_Owner_Name')->nullable();
            $table->string('CO_Mail_Street_Address')->nullable();
            $table->string('CO_Mailing_City')->nullable();
            $table->string('CO_Mailing_State')->nullable();
            $table->string('CO_Mailing_Zip_Code')->nullable();
            $table->string('CO_Mailing_Zip_Plus4Code')->nullable();
            $table->string('CO_Unit_Number')->nullable();
            $table->string('Mail_Care_Of_Name_Indicator')->nullable();
            $table->string('Owner_Occupied')->nullable();
            $table->string('Owner1FirstName')->nullable();
            $table->string('Owner1LastName')->nullable();
            $table->string('Owner2Firstname')->nullable();
            $table->string('Owner2LastName')->nullable();
            $table->string('Length_of_Residence_Months')->nullable();
            $table->string('Ownership_Start_Date')->nullable();
            $table->string('LSale_Price')->nullable();
            $table->string('LSale_Recording_Date')->nullable();
            $table->string('LValid_Price')->nullable();
            $table->string('Total_Assessed_Value')->nullable();
            $table->string('Assessment_Year')->nullable();
            $table->string('LotSize_Square_Feet')->nullable();
            $table->string('Building_Area')->nullable();
            $table->string('No_of_Stories')->nullable();
            $table->string('Number_of_Baths')->nullable();
            $table->string('Number_of_Bedrooms')->nullable();
            $table->string('Mtg01_lender_name_beneficiary')->nullable();
            $table->string('Mtg01_recording_date')->nullable();
            $table->string('Mtg01_Loan_Amount')->nullable();
            $table->string('Mtg01_loan_type')->nullable();
            $table->string('Mtg01_interest_rate')->nullable();
            $table->string('Mtg01_due_date')->nullable();
            $table->string('Mtg01_Loan_Term_Years')->nullable();
            $table->string('Mtg01_Equity_Credit_Line')->nullable();
            $table->string('Mtg01_Curr_Est_Bal')->nullable();
            $table->string('Mtg02_lender_name_beneficiary')->nullable();
            $table->string('Mtg02_recording_date')->nullable();
            $table->string('Mtg02_Loan_Amount')->nullable();
            $table->string('Mtg02_loan_type')->nullable();
            $table->string('Mtg02_interest_rate')->nullable();
            $table->string('Mtg02_due_date')->nullable();
            $table->string('Mtg02_Loan_Term_Years')->nullable();
            $table->string('Mtg02_Equity_Credit_Line')->nullable();
            $table->string('Mtg02_Curr_Est_Bal')->nullable();
            $table->string('Total_Open_Lien_Count')->nullable();
            $table->string('Total_Open_Lien_Balance')->nullable();
            $table->string('Current_Est_LTV_Combined')->nullable();
            $table->string('Current_Est_Equity_Dollars')->nullable();
            $table->string('Current_Foreclosure_Status')->nullable();
            $table->string('Foreclosure_Recording_Date')->nullable();
            $table->string('Foreclosure_filing_date')->nullable();
            $table->string('Foreclosure_Auction_Date')->nullable();
            $table->string('ESTIMATED_VALUE')->nullable();
            $table->string('CONFIDENCE_SCORE')->nullable();
            $table->string('QVM_asof_Date')->nullable();
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
