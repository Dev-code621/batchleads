<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
  protected $fillable = [
        'address1',
        'address2',
        'location_latitude',
        'location_longitude',
        'photo_url',
        'folder_id',
        'state_id',
        'contact_info_id',
        'status',
        'Assessors_Parcel_Number',
        'Current_Owner_Name',
        'CO_Mail_Street_Address',
        'CO_Mailing_City',
        'CO_Mailing_State',
        'CO_Mailing_Zip_Code',
        'CO_Mailing_Zip_Plus4Code',
        'CO_Unit_Number',
        'Mail_Care_Of_Name_Indicator',
        'Owner_Occupied',
        'Owner1FirstName',
        'Owner1LastName',
        'Owner2Firstname',
        'Owner2LastName',
        'Length_of_Residence_Months',
        'Ownership_Start_Date',
        'LSale_Price',
        'LSale_Recording_Date',
        'LValid_Price',
        'Total_Assessed_Value',
        'Assessment_Year',
        'LotSize_Square_Feet',
        'Building_Area',
        'No_of_Stories',
        'Number_of_Baths',
        'Number_of_Bedrooms',
        'Mtg01_lender_name_beneficiary',
        'Mtg01_recording_date',
        'Mtg01_Loan_Amount',
        'Mtg01_loan_type',
        'Mtg01_interest_rate',
        'Mtg01_due_date',
        'Mtg01_Loan_Term_Years',
        'Mtg01_Equity_Credit_Line',
        'Mtg01_Curr_Est_Bal',
        'Mtg02_lender_name_beneficiary',
        'Mtg02_recording_date',
        'Mtg02_Loan_Amount',
        'Mtg02_loan_type',
        'Mtg02_interest_rate',
        'Mtg02_due_date',
        'Mtg02_Loan_Term_Years',
        'Mtg02_Equity_Credit_Line',
        'Mtg02_Curr_Est_Bal',
        'Total_Open_Lien_Count',
        'Total_Open_Lien_Balance',
        'Current_Est_LTV_Combined',
        'Current_Est_Equity_Dollars',
        'Current_Foreclosure_Status',
        'Foreclosure_Recording_Date',
        'Foreclosure_filing_date',
        'Foreclosure_Auction_Date',
        'ESTIMATED_VALUE',
        'CONFIDENCE_SCORE',
        'QVM_asof_Date',
        'team_id',
        'skip_tracing_date',
        'photo_url',
        'driving_route_id',
        'driving_route_temp_id',
        'Mailing_Zip5',
        'Site_Address',
        'Site_City',
        'Site_State',
        'Site_Zip5',
        'Site_Zip4',
        'Sale_Date',
        'Sale_Price',
        'Mortgage_Amount',
        'Lender_Name',
        'Assessed_Value',
        'Improvement_Value',
        'Land_Value',
        'Total_Value',
        'Year_Built',
        'Baths',
        'Bedrooms',
        'Square_Footage',
        'Acreage',
        'Property_Type',
        'Owner_Type',
        'Last_Sale_Date',
        'Number_of_Units',
        'pool',
        'fireplace',
        'Air_Conditioning_Source',
        'Air_Conditioning_Type',
        'Construction_Type',
        'Heating_Type',
        'Garage_Type',
        'Roof_Type',
        'foundation',
        'Number_of_Garages',
        'property_class',
        'zoning',
        'Lot_Size_Acres',
        'Legal_Description',
        'Lot_Number',
        'totalMarketValue',
        'assessmentYear',
        'taxAmount',
        'taxYear',
        'assessedImprovementValue',
        'marketValueYear',
        'totalFinancingHistoryCount',
        'documentType',
        'recordingDate',
        'age',
        'householdSize',
        'income',
        'netWorth',
        'discretionaryIncome',
        'businessOwner',
        'gender',
        'hasChildren',
        'investmentRealEstate',
        'maritalStatus',
        'petOwner',
        'singleParent',
        'smoker',
        'vehiclesOwned',
        'religiousAffiliation',
        'lenderType',
        'originalDateOfContract',
        'typeFinancing',
        'lenderMailingAddress_street',
        'lenderMailingAddress_city',
        'lenderMailingAddress_state',
        'lenderMailingAddress_zip',
        'lenderMailingAddress_zipPlus4',
        'lenderMailingAddress_unitNumber',
        'estimatedMonthlyPrincipalAndInterest',
        'estimatedMonthlyPrincipal',
        'estimatedMonthlyInterest',
        'address_hash'
    ];

    // protected $appends = ['folder', 'emails', 'phones', 'images', 'sms_campaign_count', 'mail_campaign_count', 'sms_campaigns', 'mail_campaigns', 'tags'];
    protected $appends = ['state'];

    public function getStateAttribute()
    {
        return $this->state()->first();
    }

    public function getFolderAttribute()
    {
        return $this->folder()->first();
    }

    public function getEmailsAttribute()
    {
        return $this->emails()->get();
    }

    public function getPhonesAttribute()
    {
        return $this->phones()->get();
    }

    public function getImagesAttribute()
    {
        return $this->images()->get();
    }

    public function getSmsCampaignCountAttribute()
    {
        return $this->smsCampaignProperties()->count();
    }

    public function getMailCampaignCountAttribute()
    {
        return $this->mailCampaignProperties()->count();
    }

    public function getSmsCampaignsAttribute()
    {
        return $this->smsCampaigns()->get();
    }

    public function getMailCampaignsAttribute()
    {
        return $this->mailCampaigns()->get();
    }

    public function getTagsAttribute()
    {
        return $this->tags()->get();
    }

    public function folder() {
        return $this->belongsTo('App\Models\Folder');
    }

    public function skipTracings() {
        return $this->hasMany('App\Models\SkipTracing');
    }

    public function emails() {
        return $this->hasMany('App\Models\PropertyEmail');
    }

    public function phones() {
        return $this->hasMany('App\Models\PropertyPhone');
    }

    public function images() {
        return $this->hasMany('App\Models\PropertyImage');
    }

    public function smsCampaignProperties() {
        return $this->hasMany('App\Models\SmsCampaignProperty');
    }

    public function smsCampaigns() {
        return $this->belongsToMany('App\Models\SmsCampaign', 'sms_campaign_properties');
    }

    public function mailCampaignProperties() {
        return $this->hasMany('App\Models\MailCampaignProperty');
    }

    public function mailCampaigns() {
        return $this->belongsToMany('App\Models\MailCampaign', 'mail_campaign_properties');
    }

    public function drivingRoute() {
        return $this->belongsTo('App\Models\DrivingRoute');
    }

    public function histories() {
        return $this->hasMany('App\Models\PropertyHistories');
    }

    public function user() {
        return $this->belongsTo('App\Models\User');
    }

    public function tags() {
        return $this->hasMany('App\Models\PropertyTag');
    }

    public function state() {
        return $this->belongsTo('App\Models\State');
    }
}
