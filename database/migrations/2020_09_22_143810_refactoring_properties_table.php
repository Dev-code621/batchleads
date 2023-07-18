<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RefactoringPropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            if (Schema::hasColumn('properties', 'contact_info_id')) {
                $table->dropColumn('contact_info_id');
            }
            if (Schema::hasColumn('properties', 'Assessors_Parcel_Number')) {
                $table->dropColumn('Assessors_Parcel_Number');
            }
            if (Schema::hasColumn('properties', 'CO_Unit_Number')) {
                $table->dropColumn('CO_Unit_Number');
            }
            if (Schema::hasColumn('properties', 'Mail_Care_Of_Name_Indicator')) {
                $table->dropColumn('Mail_Care_Of_Name_Indicator');
            }
            if (Schema::hasColumn('properties', 'Length_of_Residence_Months')) {
                $table->dropColumn('Length_of_Residence_Months');
            }
            if (Schema::hasColumn('properties', 'Ownership_Start_Date')) {
                $table->dropColumn('Ownership_Start_Date');
            }
            if (Schema::hasColumn('properties', 'LSale_Price')) {
                $table->dropColumn('LSale_Price');
            }
            if (Schema::hasColumn('properties', 'LSale_Recording_Date')) {
                $table->dropColumn('LSale_Recording_Date');
            }
            if (Schema::hasColumn('properties', 'LValid_Price')) {
                $table->dropColumn('LValid_Price');
            }
            if (Schema::hasColumn('properties', 'Total_Assessed_Value')) {
                $table->dropColumn('Total_Assessed_Value');
            }
            if (Schema::hasColumn('properties', 'Assessment_Year')) {
                $table->dropColumn('Assessment_Year');
            }
            if (Schema::hasColumn('properties', 'LotSize_Square_Feet')) {
                $table->dropColumn('LotSize_Square_Feet');
            }
            if (Schema::hasColumn('properties', 'Building_Area')) {
                $table->dropColumn('Building_Area');
            }
            if (Schema::hasColumn('properties', 'No_of_Stories')) {
                $table->dropColumn('No_of_Stories');
            }
            if (Schema::hasColumn('properties', 'Number_of_Baths')) {
                $table->dropColumn('Number_of_Baths');
            }
            if (Schema::hasColumn('properties', 'Number_of_Bedrooms')) {
                $table->dropColumn('Number_of_Bedrooms');
            }
            if (Schema::hasColumn('properties', 'Mtg01_lender_name_beneficiary')) {
                $table->dropColumn('Mtg01_lender_name_beneficiary');
            }
            if (Schema::hasColumn('properties', 'Mtg01_recording_date')) {
                $table->dropColumn('Mtg01_recording_date');
            }
            if (Schema::hasColumn('properties', 'Mtg01_Loan_Amount')) {
                $table->dropColumn('Mtg01_Loan_Amount');
            }
            if (Schema::hasColumn('properties', 'Mtg01_loan_type')) {
                $table->dropColumn('Mtg01_loan_type');
            }
            if (Schema::hasColumn('properties', 'Mtg01_interest_rate')) {
                $table->dropColumn('Mtg01_interest_rate');
            }
            if (Schema::hasColumn('properties', 'Mtg01_due_date')) {
                $table->dropColumn('Mtg01_due_date');
            }
            if (Schema::hasColumn('properties', 'Mtg01_Loan_Term_Years')) {
                $table->dropColumn('Mtg01_Loan_Term_Years');
            }
            if (Schema::hasColumn('properties', 'Mtg01_Equity_Credit_Line')) {
                $table->dropColumn('Mtg01_Equity_Credit_Line');
            }
            if (Schema::hasColumn('properties', 'Mtg01_Curr_Est_Bal')) {
                $table->dropColumn('Mtg01_Curr_Est_Bal');
            }
            if (Schema::hasColumn('properties', 'Mtg02_lender_name_beneficiary')) {
                $table->dropColumn('Mtg02_lender_name_beneficiary');
            }
            if (Schema::hasColumn('properties', 'Mtg02_recording_date')) {
                $table->dropColumn('Mtg02_recording_date');
            }
            $table->dropColumn('Mtg02_Loan_Amount');
            $table->dropColumn('Mtg02_interest_rate');
            $table->dropColumn('Mtg02_due_date');
            $table->dropColumn('Mtg02_Loan_Term_Years');
            $table->dropColumn('Mtg02_Equity_Credit_Line');
            $table->dropColumn('Mtg02_Curr_Est_Bal');
            $table->dropColumn('Total_Open_Lien_Count');
            $table->dropColumn('Total_Open_Lien_Balance');
            $table->dropColumn('Current_Est_LTV_Combined');
            $table->dropColumn('Current_Est_Equity_Dollars');
            $table->dropColumn('Current_Foreclosure_Status');
            $table->dropColumn('Foreclosure_Recording_Date');
            $table->dropColumn('Foreclosure_filing_date');
            $table->dropColumn('Foreclosure_Auction_Date');
            $table->dropColumn('ESTIMATED_VALUE');
            $table->dropColumn('QVM_asof_Date');
            $table->dropColumn('Mailing_Zip5');
            $table->dropColumn('Sale_Date');
            $table->dropColumn('Sale_Price');
            $table->dropColumn('Mortgage_Amount');
            $table->dropColumn('Lender_Name');
            $table->dropColumn('Assessed_Value');
            $table->dropColumn('Improvement_Value');
            $table->dropColumn('Land_Value');
            $table->dropColumn('Total_Value');
            $table->dropColumn('Year_Built');
            $table->dropColumn('Baths');
            $table->dropColumn('Bedrooms');
            $table->dropColumn('Square_Footage');
            $table->dropColumn('Acreage');
            $table->dropColumn('Property_Type');
            $table->dropColumn('Owner_Type');
            $table->dropColumn('Last_Sale_Date');
            $table->dropColumn('Number_of_Units');
            $table->dropColumn('pool');
            $table->dropColumn('fireplace');
            $table->dropColumn('Air_Conditioning_Source');
            $table->dropColumn('Air_Conditioning_Type');
            $table->dropColumn('Construction_Type');
            $table->dropColumn('Heating_Type');
            $table->dropColumn('Garage_Type');
            $table->dropColumn('Roof_Type');
            $table->dropColumn('foundation');
            $table->dropColumn('Number_of_Garages');
            $table->dropColumn('property_class');
            $table->dropColumn('zoning');
            $table->dropColumn('Lot_Size_Acres');
            $table->dropColumn('Legal_Description');
            $table->dropColumn('Lot_Number');
            $table->dropColumn('subdivision');
            $table->dropColumn('totalMarketValue');
            $table->dropColumn('assessmentYear');
            $table->dropColumn('taxAmount');
            $table->dropColumn('taxYear');
            $table->dropColumn('assessedImprovementValue');
            $table->dropColumn('marketValueYear');
            $table->dropColumn('totalFinancingHistoryCount');
            $table->dropColumn('documentType');
            $table->dropColumn('distressedSaleFlag');
            $table->dropColumn('recordingDate');
            $table->dropColumn('age');
            $table->dropColumn('householdSize');
            $table->dropColumn('income');
            $table->dropColumn('netWorth');
            $table->dropColumn('discretionaryIncome');
            $table->dropColumn('businessOwner');
            $table->dropColumn('gender');
            $table->dropColumn('hasChildren');
            $table->dropColumn('investmentRealEstate');
            $table->dropColumn('maritalStatus');
            $table->dropColumn('petOwner');
            $table->dropColumn('singleParent');
            $table->dropColumn('smoker');
            $table->dropColumn('vehiclesOwned');
            $table->dropColumn('religiousAffiliation');
            $table->dropColumn('lenderType');
            $table->dropColumn('originalDateOfContract');
            $table->dropColumn('typeFinancing');
            $table->dropColumn('lenderMailingAddress_street');
            $table->dropColumn('lenderMailingAddress_city');
            $table->dropColumn('lenderMailingAddress_state');
            $table->dropColumn('lenderMailingAddress_zip');
            $table->dropColumn('lenderMailingAddress_zipPlus4');
            $table->dropColumn('lenderMailingAddress_unitNumber');
            $table->dropColumn('estimatedMonthlyPrincipalAndInterest');
            $table->dropColumn('estimatedMonthlyPrincipal');
            $table->dropColumn('estimatedMonthlyInterest');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}
