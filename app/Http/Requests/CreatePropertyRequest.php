<?php

namespace App\Http\Requests;

/**
 * Class CreatePropertyRequest
 * @package App\Http\Requests
 */
class CreatePropertyRequest extends ApiRequest
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
        $rules = [
            'folder_id'                     => 'required|integer',
            // 'state_id'                      => 'nullable|integer|exists:states,id',
            'address1'                      => 'nullable',
            'address2'                      => 'nullable',
            'location_latitude'             => 'required|numeric',
            'location_longitude'            => 'required|numeric',
            'contact_info_id'               => 'nullable',
            // 'status'                        => 'nullable|in:New,Hot,Not Interested,Currently Marketing,Dead Deal,Danger',
            'status'                        => 'required|string|max:255',
            'Assessors_Parcel_Number'       => 'nullable',
            'Current_Owner_Name'            => 'nullable',
            'CO_Mail_Street_Address'        => 'nullable',
            'CO_Mailing_City'               => 'nullable',
            'CO_Mailing_State'              => 'nullable',
            'CO_Mailing_Zip_Code'           => 'nullable',
            'CO_Mailing_Zip_Plus4Code'      => 'nullable',
            'CO_Unit_Number'                => 'nullable',
            'Mail_Care_Of_Name_Indicator'   => 'nullable',
            'Owner_Occupied'                => 'nullable',
            'Owner1FirstName'               => 'nullable',
            'Owner1LastName'                => 'nullable',
            'Owner2Firstname'               => 'nullable',
            'Owner2LastName'                => 'nullable',
            'Length_of_Residence_Months'    => 'nullable',
            'Ownership_Start_Date'          => 'nullable',
            'LSale_Price'                   => 'nullable',
            'LSale_Recording_Date'          => 'nullable',
            'LValid_Price'                  => 'nullable',
            'Total_Assessed_Value'          => 'nullable',
            'Assessment_Year'               => 'nullable',
            'LotSize_Square_Feet'           => 'nullable',
            'Building_Area'                 => 'nullable',
            'No_of_Stories'                 => 'nullable',
            'Number_of_Baths'               => 'nullable',
            'Number_of_Bedrooms'            => 'nullable',
            'Mtg01_lender_name_beneficiary' => 'nullable',
            'Mtg01_recording_date'          => 'nullable',
            'Mtg01_Loan_Amount'             => 'nullable',
            'Mtg01_loan_type'               => 'nullable',
            'Mtg01_interest_rate'           => 'nullable',
            'Mtg01_due_date'                => 'nullable',
            'Mtg01_Loan_Term_Years'         => 'nullable',
            'Mtg01_Equity_Credit_Line'      => 'nullable',
            'Mtg01_Curr_Est_Bal'            => 'nullable',
            'Mtg02_lender_name_beneficiary' => 'nullable',
            'Mtg02_recording_date'          => 'nullable',
            'Mtg02_Loan_Amount'             => 'nullable',
            'Mtg02_loan_type'               => 'nullable',
            'Mtg02_interest_rate'           => 'nullable',
            'Mtg02_due_date'                => 'nullable',
            'Mtg02_Loan_Term_Years'         => 'nullable',
            'Mtg02_Equity_Credit_Line'      => 'nullable',
            'Mtg02_Curr_Est_Bal'            => 'nullable',
            'Total_Open_Lien_Count'         => 'nullable',
            'Total_Open_Lien_Balance'       => 'nullable',
            'Current_Est_LTV_Combined'      => 'nullable',
            'Current_Est_Equity_Dollars'    => 'nullable',
            'Current_Foreclosure_Status'    => 'nullable',
            'Foreclosure_Recording_Date'    => 'nullable',
            'Foreclosure_filing_date'       => 'nullable',
            'Foreclosure_Auction_Date'      => 'nullable',
            'ESTIMATED_VALUE'               => 'nullable',
            'CONFIDENCE_SCORE'              => 'nullable',
            'QVM_asof_Date '                => 'nullable',
            'driving_route_temp_id'         => 'nullable|integer',
            'images'                        => 'nullable|array',
            'images.*'                      => 'image|mimes:jpeg,bmp,png|max:8000',
            'Mailing_Zip5'                  => 'nullable',
            'Site_Address'                  => 'nullable',
            'Site_City'                     => 'nullable',
            'Site_State'                    => 'nullable',
            'Site_Zip5'                     => 'nullable',
            'Site_Zip4'                     => 'nullable',
            'Owner_Occupied'                => 'nullable',
            'Sale_Date'                     => 'nullable',
            'Sale_Price'                    => 'nullable',
            'Mortgage_Amount'               => 'nullable',
            'Lender_Name'                   => 'nullable',
            'Assessed_Value'                => 'nullable',
            'Improvement_Value'             => 'nullable',
            'Land_Value'                    => 'nullable',
            'Total_Value'                   => 'nullable',
            'Year_Built'                    => 'nullable',
            'Baths'                         => 'nullable',
            'Bedrooms'                      => 'nullable',
            'Square_Footage'                => 'nullable',
            'Acreage'                       => 'nullable',
            'address_hash'                  => 'required',
            'Property_Type'                 => 'nullable',
            'Owner_Type'                    => 'nullable',
            'Last_Sale_Date'                => 'nullable',
            'Number_of_Units'               => 'nullable',
            'pool'                          => 'nullable',
            'fireplace'                     => 'nullable',
            'Air_Conditioning_Source'       => 'nullable',
            'Air_Conditioning_Type'         => 'nullable',
            'Construction_Type'             => 'nullable',
            'Heating_Type'                  => 'nullable',
            'Garage_Type'                   => 'nullable',
            'Roof_Type'                     => 'nullable',
            'foundation'                    => 'nullable',
            'Number_of_Garages'             => 'nullable',
            'property_class'                => 'nullable',
            'zoning'                        => 'nullable',
            'Lot_Size_Acres'                => 'nullable',
            'Legal_Description'             => 'nullable',
            'Lot_Number'                    => 'nullable',
            'totalMarketValue'              => 'nullable',
            'assessmentYear'                => 'nullable',
            'taxAmount'                     => 'nullable',
            'taxYear'                       => 'nullable',
            'assessedImprovementValue'      => 'nullable',
            'marketValueYear'               => 'nullable',
            'totalFinancingHistoryCount'    => 'nullable',
            'documentType'                  => 'nullable',
            'recordingDate'                 => 'nullable',
            'age'                           => 'nullable',
            'householdSize'                 => 'nullable',
            'income'                        => 'nullable',
            'netWorth'                      => 'nullable',
            'discretionaryIncome'           => 'nullable',
            'businessOwner'                 => 'nullable',
            'gender'                        => 'nullable',
            'hasChildren'                   => 'nullable',
            'investmentRealEstate'          => 'nullable',
            'maritalStatus'                 => 'nullable',
            'petOwner'                      => 'nullable',
            'singleParent'                  => 'nullable',
            'smoker'                        => 'nullable',
            'vehiclesOwned'                 => 'nullable',
            'religiousAffiliation'          => 'nullable',
        ];

        return $rules;
    }
}
