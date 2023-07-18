<?php

namespace App\Http\Requests;

/**
 * Class PropertyBulkAddRequest
 * @package App\Http\Requests
 */
class PropertyBulkAddRequest extends ApiRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'properties'                                 => 'required|array',
            'properties.*.address1'                      => 'nullable',
            'properties.*.address2'                      => 'nullable',
            'properties.*.location_latitude'             => 'required|numeric',
            'properties.*.location_longitude'            => 'required|numeric',
            'properties.*.contact_info_id'               => 'nullable',
            'properties.*.Assessors_Parcel_Number'       => 'nullable',
            'properties.*.Current_Owner_Name'            => 'nullable',
            'properties.*.CO_Mail_Street_Address'        => 'nullable',
            'properties.*.CO_Mailing_City'               => 'nullable',
            'properties.*.CO_Mailing_State'              => 'nullable',
            'properties.*.CO_Mailing_Zip_Code'           => 'nullable',
            'properties.*.CO_Mailing_Zip_Plus4Code'      => 'nullable',
            'properties.*.CO_Unit_Number'                => 'nullable',
            'properties.*.Mail_Care_Of_Name_Indicator'   => 'nullable',
            'properties.*.Owner_Occupied'                => 'nullable',
            'properties.*.Owner1FirstName'               => 'nullable',
            'properties.*.Owner1LastName'                => 'nullable',
            'properties.*.Owner2Firstname'               => 'nullable',
            'properties.*.Owner2LastName'                => 'nullable',
            'properties.*.Length_of_Residence_Months'    => 'nullable',
            'properties.*.Ownership_Start_Date'          => 'nullable',
            'properties.*.LSale_Price'                   => 'nullable',
            'properties.*.LSale_Recording_Date'          => 'nullable',
            'properties.*.LValid_Price'                  => 'nullable',
            'properties.*.Total_Assessed_Value'          => 'nullable',
            'properties.*.Assessment_Year'               => 'nullable',
            'properties.*.LotSize_Square_Feet'           => 'nullable',
            'properties.*.Building_Area'                 => 'nullable',
            'properties.*.No_of_Stories'                 => 'nullable',
            'properties.*.Number_of_Baths'               => 'nullable',
            'properties.*.Number_of_Bedrooms'            => 'nullable',
            'properties.*.Mtg01_lender_name_beneficiary' => 'nullable',
            'properties.*.Mtg01_recording_date'          => 'nullable',
            'properties.*.Mtg01_Loan_Amount'             => 'nullable',
            'properties.*.Mtg01_loan_type'               => 'nullable',
            'properties.*.Mtg01_interest_rate'           => 'nullable',
            'properties.*.Mtg01_due_date'                => 'nullable',
            'properties.*.Mtg01_Loan_Term_Years'         => 'nullable',
            'properties.*.Mtg01_Equity_Credit_Line'      => 'nullable',
            'properties.*.Mtg01_Curr_Est_Bal'            => 'nullable',
            'properties.*.Mtg02_lender_name_beneficiary' => 'nullable',
            'properties.*.Mtg02_recording_date'          => 'nullable',
            'properties.*.Mtg02_Loan_Amount'             => 'nullable',
            'properties.*.Mtg02_loan_type'               => 'nullable',
            'properties.*.Mtg02_interest_rate'           => 'nullable',
            'properties.*.Mtg02_due_date'                => 'nullable',
            'properties.*.Mtg02_Loan_Term_Years'         => 'nullable',
            'properties.*.Mtg02_Equity_Credit_Line'      => 'nullable',
            'properties.*.Mtg02_Curr_Est_Bal'            => 'nullable',
            'properties.*.Total_Open_Lien_Count'         => 'nullable',
            'properties.*.Total_Open_Lien_Balance'       => 'nullable',
            'properties.*.Current_Est_LTV_Combined'      => 'nullable',
            'properties.*.Current_Est_Equity_Dollars'    => 'nullable',
            'properties.*.Current_Foreclosure_Status'    => 'nullable',
            'properties.*.Foreclosure_Recording_Date'    => 'nullable',
            'properties.*.Foreclosure_filing_date'       => 'nullable',
            'properties.*.Foreclosure_Auction_Date'      => 'nullable',
            'properties.*.ESTIMATED_VALUE'               => 'nullable',
            'properties.*.CONFIDENCE_SCORE'              => 'nullable',
            'properties.*.QVM_asof_Date '                => 'nullable',
            'properties.*.file'                          => 'nullable|image|max:8000',
            'properties.*.driving_route_temp_id'         => 'nullable|integer',
            'folder_id'                                  => 'required|integer',
            'properties.*.Mailing_Zip5'                  => 'nullable',
            'properties.*.Site_Address'                  => 'nullable',
            'properties.*.Site_City'                     => 'nullable',
            'properties.*.Site_State'                    => 'nullable',
            'properties.*.Site_Zip5'                     => 'nullable',
            'properties.*.Site_Zip4'                     => 'nullable',
            'properties.*.address_hash'                  => 'required',
            'properties.*.Property_Type'                 => 'nullable',
            'properties.*.Owner_Type'                    => 'nullable',
            'properties.*.Last_Sale_Date'                => 'nullable',
            'properties.*.Number_of_Units'               => 'nullable',
            'properties.*.pool'                          => 'nullable',
            'properties.*.fireplace'                     => 'nullable',
            'properties.*.Air_Conditioning_Source'       => 'nullable',
            'properties.*.Air_Conditioning_Type'         => 'nullable',
            'properties.*.Construction_Type'             => 'nullable',
            'properties.*.Heating_Type'                  => 'nullable',
            'properties.*.Garage_Type'                   => 'nullable',
            'properties.*.Roof_Type'                     => 'nullable',
            'properties.*.foundation'                    => 'nullable',
            'properties.*.Number_of_Garages'             => 'nullable',
            'properties.*.property_class'                => 'nullable',
            'properties.*.zoning'                        => 'nullable',
            'properties.*.Lot_Size_Acres'                => 'nullable',
            'properties.*.Legal_Description'             => 'nullable',
            'properties.*.Lot_Number'                    => 'nullable',
            'properties.*.totalMarketValue'              => 'nullable',
            'properties.*.assessmentYear'                => 'nullable',
            'properties.*.taxAmount'                     => 'nullable',
            'properties.*.taxYear'                       => 'nullable',
            'properties.*.assessedImprovementValue'      => 'nullable',
            'properties.*.marketValueYear'               => 'nullable',
            'properties.*.totalFinancingHistoryCount'    => 'nullable',
            'properties.*.documentType'                  => 'nullable',
            'properties.*.recordingDate'                 => 'nullable',
            'properties.*.age'                           => 'nullable',
            'properties.*.householdSize'                 => 'nullable',
            'properties.*.income'                        => 'nullable',
            'properties.*.netWorth'                      => 'nullable',
            'properties.*.discretionaryIncome'           => 'nullable',
            'properties.*.businessOwner'                 => 'nullable',
            'properties.*.gender'                        => 'nullable',
            'properties.*.hasChildren'                   => 'nullable',
            'properties.*.investmentRealEstate'          => 'nullable',
            'properties.*.maritalStatus'                 => 'nullable',
            'properties.*.petOwner'                      => 'nullable',
            'properties.*.singleParent'                  => 'nullable',
            'properties.*.smoker'                        => 'nullable',
            'properties.*.vehiclesOwned'                 => 'nullable',
            'properties.*.religiousAffiliation'          => 'nullable',
        ];
    }
}
