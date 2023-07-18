<?php

namespace App\Http\Requests;

/**
 * Class UpdatePropertyRequest
 * @package App\Http\Requests
 */
class UpdatePropertyRequest extends DefaultUpdateRequest
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
            'id'                            => 'required|integer',
            'folder_id'                     => 'required|integer',
            'state_id'                      => 'nullable|integer|exists:states,id',
            'address1'                      => 'nullable',
            'address2'                      => 'nullable',
            'location_latitude'             => 'required|numeric',
            'location_longitude'            => 'required|numeric',
            'contact_info_id'               => 'nullable',
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
            'images'                        => 'nullable|array',
            'images.*'                      => 'image|mimes:jpeg,bmp,png|max:8000',
            'removed_image_ids'             => 'nullable|array',
            'removed_image_ids.*'           => 'integer',
            'Mailing_Zip5'                  => 'nullable',
            'Site_Address'                  => 'nullable',
            'Site_City'                     => 'nullable',
            'Site_State'                    => 'nullable',
            'Site_Zip5'                     => 'nullable',
            'Site_Zip4'                     => 'nullable',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['id'] = $this->route('id');

        return $data;
    }
}
