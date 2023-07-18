<?php
namespace App\Repositories;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Property;
use App\Models\SmsCampaignProperty;
use App\Models\MailCampaignProperty;

/**
 * Class PropertyRepository
 *
 * @package App\Http\Repositories
 */
class PropertyRepository extends BaseRepository
{
    /**
     * PropertyRepository constructor.
     *
     * @param Property $property
     */
    public function __construct(Property $property)
    {
        $this->model = $property;
    }

    public function find(int $id, array $relationships = [])
    {
        $property = $this->model
            ->with($relationships)
            ->find($id);
        if ($property) {
            $property['sms_campaign_count'] = $property->getSmsCampaignCountAttribute();
            $property['mail_campaign_count'] = $property->getMailCampaignCountAttribute();
        }

        return $property;
    }

    public function update(int $id, array $data)
    {
        $find = $this->find($id);
        unset($find['sms_campaign_count']);
        unset($find['mail_campaign_count']);
        return $find ? $find->update($data) : false;
    }

    /**
     * @param array $data
     *
     * @return Property|null
     */
    public function create(array $data)
    {
        $property = $this->model->newInstance();
        $property->folder_id = $data['folder_id'] ?? null;
        $property->state_id = $data['state_id'] ?? null;
        $property->address1 = $data['address1'] ?? null;
        $property->address2 = $data['address2'] ?? null;
        $property->location_latitude = $data['location_latitude'] ?? null;
        $property->location_longitude = $data['location_longitude'] ?? null;
        // $property->contact_info_id = $data['contact_info_id'] ?? null;
        $property->status = $data['status'] ?? null;
        // $property->Assessors_Parcel_Number = $data['Assessors_Parcel_Number'] ?? null;
        $property->Current_Owner_Name = $data['Current_Owner_Name'] ?? null;
        $property->CO_Mail_Street_Address = $data['CO_Mail_Street_Address'] ?? null;
        $property->CO_Mailing_City = $data['CO_Mailing_City'] ?? null;
        $property->CO_Mailing_State = $data['CO_Mailing_State'] ?? null;
        $property->CO_Mailing_Zip_Code = $data['CO_Mailing_Zip_Code'] ?? null;
        $property->CO_Mailing_Zip_Plus4Code = $data['CO_Mailing_Zip_Plus4Code'] ?? null;
        // $property->CO_Unit_Number = $data['CO_Unit_Number'] ?? null;
        // $property->Mail_Care_Of_Name_Indicator = $data['Mail_Care_Of_Name_Indicator'] ?? null;
        $property->Owner_Occupied = $data['Owner_Occupied'] ?? null;
        $property->Owner1FirstName = $data['Owner1FirstName'] ?? null;
        $property->Owner1LastName = $data['Owner1LastName'] ?? null;
        $property->Owner2Firstname = $data['Owner2Firstname'] ?? null;
        $property->Owner2LastName = $data['Owner2LastName'] ?? null;
        // $property->Length_of_Residence_Months = $data['Length_of_Residence_Months'] ?? null;
        // $property->Ownership_Start_Date = $data['Ownership_Start_Date'] ?? null;
        // $property->LSale_Price = $data['LSale_Price'] ?? null;
        // $property->LSale_Recording_Date = $data['LSale_Recording_Date'] ?? null;
        // $property->LValid_Price = $data['LValid_Price'] ?? null;
        // $property->Total_Assessed_Value = $data['Total_Assessed_Value'] ?? null;
        // $property->Assessment_Year = $data['Assessment_Year'] ?? null;
        // $property->LotSize_Square_Feet = $data['LotSize_Square_Feet'] ?? null;
        // $property->Building_Area = $data['Building_Area'] ?? null;
        // $property->No_of_Stories = $data['No_of_Stories'] ?? null;
        // $property->Number_of_Baths = $data['Number_of_Baths'] ?? null;
        // $property->Number_of_Bedrooms = $data['Number_of_Bedrooms'] ?? null;
        // $property->Mtg01_lender_name_beneficiary = $data['Mtg01_lender_name_beneficiary'] ?? null;
        // $property->Mtg01_recording_date = $data['Mtg01_recording_date'] ?? null;
        // $property->Mtg01_Loan_Amount = $data['Mtg01_Loan_Amount'] ?? null;
        // $property->Mtg01_loan_type = $data['Mtg01_loan_type'] ?? null;
        // $property->Mtg01_interest_rate = $data['Mtg01_interest_rate'] ?? null;
        // $property->Mtg01_due_date = $data['Mtg01_due_date'] ?? null;
        // $property->Mtg01_Loan_Term_Years = $data['Mtg01_Loan_Term_Years'] ?? null;
        // $property->Mtg01_Equity_Credit_Line = $data['Mtg01_Equity_Credit_Line'] ?? null;
        // $property->Mtg01_Curr_Est_Bal = $data['Mtg01_Curr_Est_Bal'] ?? null;
        // $property->Mtg02_lender_name_beneficiary = $data['Mtg02_lender_name_beneficiary'] ?? null;
        // $property->Mtg02_recording_date = $data['Mtg02_recording_date'] ?? null;
        // $property->Mtg02_Loan_Amount = $data['Mtg02_Loan_Amount'] ?? null;
        // $property->Mtg02_loan_type = $data['Mtg02_loan_type'] ?? null;
        // $property->Mtg02_interest_rate = $data['Mtg02_interest_rate'] ?? null;
        // $property->Mtg02_due_date = $data['Mtg02_due_date'] ?? null;
        // $property->Mtg02_Loan_Term_Years = $data['Mtg02_Loan_Term_Years'] ?? null;
        // $property->Mtg02_Equity_Credit_Line = $data['Mtg02_Equity_Credit_Line'] ?? null;
        // $property->Mtg02_Curr_Est_Bal = $data['Mtg02_Curr_Est_Bal'] ?? null;
        // $property->Total_Open_Lien_Count = $data['Total_Open_Lien_Count'] ?? null;
        // $property->Total_Open_Lien_Balance = $data['Total_Open_Lien_Balance'] ?? null;
        // $property->Current_Est_LTV_Combined = $data['Current_Est_LTV_Combined'] ?? null;
        $property->Current_Est_Equity_Dollars = $data['Current_Est_Equity_Dollars'] ?? null;
        // $property->Current_Foreclosure_Status = $data['Current_Foreclosure_Status'] ?? null;
        // $property->Foreclosure_Recording_Date = $data['Foreclosure_Recording_Date'] ?? null;
        // $property->Foreclosure_filing_date = $data['Foreclosure_filing_date'] ?? null;
        // $property->Foreclosure_Auction_Date = $data['Foreclosure_Auction_Date'] ?? null;
        // $property->ESTIMATED_VALUE = $data['ESTIMATED_VALUE'] ?? null;
        // $property->CONFIDENCE_SCORE = $data['CONFIDENCE_SCORE'] ?? null;
        // $property->QVM_asof_Date = $data['QVM_asof_Date'] ?? null;
        $property->user_id = $data['user_id'] ?? null;
        $property->team_id = $data['team_id'] ?? null;
        $property->driving_route_temp_id = $data['driving_route_temp_id'] ?? null;
        // $property->Mailing_Zip5 = $data['Mailing_Zip5'] ?? null;
        $property->Site_Address = $data['Site_Address'] ?? null;
        $property->Site_City = $data['Site_City'] ?? null;
        $property->Site_State = $data['Site_State'] ?? null;
        $property->Site_Zip5 = $data['Site_Zip5'] ?? null;
        $property->Site_Zip4 = $data['Site_Zip4'] ?? null;
        $property->Owner_Occupied = $data['Owner_Occupied'] ?? null;
        $property->Sale_Date = $data['Sale_Date'] ?? null;
        $property->Sale_Price = $data['Sale_Price'] ?? null;
        $property->Mortgage_Amount = $data['Mortgage_Amount'] ?? null;
        // $property->Lender_Name = $data['Lender_Name'] ?? null;
        $property->Assessed_Value = $data['Assessed_Value'] ?? null;
        // $property->Improvement_Value = $data['Improvement_Value'] ?? null;
        // $property->Land_Value = $data['Land_Value'] ?? null;
        // $property->Total_Value = $data['Total_Value'] ?? null;
        $property->Year_Built = $data['Year_Built'] ?? null;
        // $property->Baths = $data['Baths'] ?? null;
        // $property->Bedrooms = $data['Bedrooms'] ?? null;
        $property->Square_Footage = $data['Square_Footage'] ?? null;
        // $property->Acreage = $data['Acreage'] ?? null;
        $property->address_hash = $data['address_hash'] ?? null;
        // $property->Property_Type = $data['Property_Type'] ?? null;
        // $property->Owner_Type = $data['Owner_Type'] ?? null;
        // $property->Last_Sale_Date = $data['Last_Sale_Date'] ?? null;
        // $property->Number_of_Units = $data['Number_of_Units'] ?? null;
        // $property->pool = $data['pool'] ?? null;
        // $property->fireplace = $data['fireplace'] ?? null;
        // $property->Air_Conditioning_Source = $data['Air_Conditioning_Source'] ?? null;
        // $property->Air_Conditioning_Type = $data['Air_Conditioning_Type'] ?? null;
        // $property->Construction_Type = $data['Construction_Type'] ?? null;
        // $property->Heating_Type = $data['Heating_Type'] ?? null;
        // $property->Garage_Type = $data['Garage_Type'] ?? null;
        // $property->Roof_Type = $data['Roof_Type'] ?? null;
        // $property->foundation = $data['foundation'] ?? null;
        // $property->Number_of_Garages = $data['Number_of_Garages'] ?? null;
        // $property->property_class = $data['property_class'] ?? null;
        // $property->zoning = $data['zoning'] ?? null;
        // $property->Lot_Size_Acres = $data['Lot_Size_Acres'] ?? null;
        // $property->Legal_Description = $data['Legal_Description'] ?? null;
        // $property->Lot_Number = $data['Lot_Number'] ?? null;
        // $property->subdivision = $data['subdivision'] ?? null;
        // $property->totalMarketValue = $data['totalMarketValue'] ?? null;
        // $property->assessmentYear = $data['assessmentYear'] ?? null;
        // $property->taxAmount = $data['taxAmount'] ?? null;
        // $property->taxYear = $data['taxYear'] ?? null;
        // $property->assessedImprovementValue = $data['assessedImprovementValue'] ?? null;
        // $property->marketValueYear = $data['marketValueYear'] ?? null;
        // $property->totalFinancingHistoryCount = $data['totalFinancingHistoryCount'] ?? null;
        // $property->documentType = $data['documentType'] ?? null;
        // $property->distressedSaleFlag = $data['distressedSaleFlag'] ?? null;
        // $property->recordingDate = $data['recordingDate'] ?? null;
        // $property->age = $data['age'] ?? null;
        // $property->householdSize = $data['householdSize'] ?? null;
        // $property->income = $data['income'] ?? null;
        // $property->netWorth = $data['netWorth'] ?? null;
        // $property->discretionaryIncome = $data['discretionaryIncome'] ?? null;
        // $property->businessOwner = $data['businessOwner'] ?? null;
        // $property->gender = $data['gender'] ?? null;
        // $property->hasChildren = $data['hasChildren'] ?? null;
        // $property->investmentRealEstate = $data['investmentRealEstate'] ?? null;
        // $property->maritalStatus = $data['maritalStatus'] ?? null;
        // $property->petOwner = $data['petOwner'] ?? null;
        // $property->singleParent = $data['singleParent'] ?? null;
        // $property->smoker = $data['smoker'] ?? null;
        // $property->vehiclesOwned = $data['vehiclesOwned'] ?? null;
        // $property->religiousAffiliation = $data['religiousAffiliation'] ?? null;
        // $property->lenderType = $data['lenderType'] ?? null;
        // $property->originalDateOfContract = $data['originalDateOfContract'] ?? null;
        // $property->typeFinancing = $data['typeFinancing'] ?? null;
        // $property->lenderMailingAddress_street = $data['lenderMailingAddress_street'] ?? null;
        // $property->lenderMailingAddress_city = $data['lenderMailingAddress_city'] ?? null;
        // $property->lenderMailingAddress_state = $data['lenderMailingAddress_state'] ?? null;
        // $property->lenderMailingAddress_zip = $data['lenderMailingAddress_zip'] ?? null;
        // $property->lenderMailingAddress_zipPlus4 = $data['lenderMailingAddress_zipPlus4'] ?? null;
        // $property->lenderMailingAddress_unitNumber = $data['lenderMailingAddress_unitNumber'] ?? null;
        // $property->estimatedMonthlyPrincipalAndInterest = $data['estimatedMonthlyPrincipalAndInterest'] ?? null;
        // $property->estimatedMonthlyPrincipal = $data['estimatedMonthlyPrincipal'] ?? null;
        // $property->estimatedMonthlyInterest = $data['estimatedMonthlyInterest'] ?? null;

        return $property->save() ? $property : null;
    }

    /**
     * @param array $params
     *
     * @return array
     */
    public function search(array $params)
    {
        $orderBy = 'properties.created_at';
        $order = $params['order'] ?? 'desc';
        $perPage = $params['per_page'] ?? 100;
        $page = $params['page'] ?? 1;
        $lat = $params['lat'] ?? null;
        $lon = $params['lon'] ?? null;
        $radius = $params['radius'] ?? 500;
        $isAll = $params['is_all'] ?? false;
        $isReset = $params['is_reset'] ?? false;
        $idOnly = $params['id_only'] ?? false;

        $excludedPropertyIds = $params['excluded_property_ids'] ?? null;

        $params['with_folder'] = true;
        $data = $this->buildSearchQuery($params, $excludedPropertyIds);

        $count_flag = false;
        if ($lat && $lon) {
            $data = $data->selectRaw('*, ( 3959 * acos( cos( radians(?) ) *
                                cos( radians( location_latitude	 ) )
                                * cos( radians( location_longitude ) - radians(?)
                                ) + sin( radians(?) ) *
                                sin( radians( location_latitude	 ) ) )
                                ) AS distance', [$lat, $lon, $lat])
                        ->havingRaw("distance < ?", [$radius * 0.000621371]);
            $distanceResult = $data->get();
            $count_flag = true;
        }

        $count = $count_flag ? count($distanceResult) : $data->count();

        $data = $data->orderBy($orderBy, $order);

        $result = null;
        if ($isAll) {
            if ($idOnly) {
                $result = $data->get(['id']);
            } else {
                $result = $data->skip(($page - 1) * $perPage)
                    ->take($perPage)
                    ->get();
            }
        } else if ($isReset) {
            $data = $data->whereNull('Sale_Date');
            $data = $data->whereNull('Sale_Price');
            $data = $data->whereNull('Current_Est_Equity_Dollars');
            $data = $data->whereNull('Mortgage_Amount');
            $data = $data->whereNull('Assessed_Value');
            $data = $data->whereNull('Year_Built');
            $data = $data->whereNull('Square_Footage');
            $result = $data->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();
        } else {
            $data = $data->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            $result = array(
                'total'          => $count,
                'page'           => $page,
                'count_per_page' => $perPage,
                'count'          => $data->count(),
                'data'           => $data,
            );
        }


        return $result;
    }

    public function filterByRegion(array $params)
    {
        $orderBy = 'properties.created_at';
        $order = $params['order'] ?? 'desc';
        $perPage = $params['per_page'] ?? 100;
        $page = $params['page'] ?? 1;
        $neLat = $params['ne_lat'] ?? null;
        $neLon = $params['ne_lon'] ?? null;
        $swLat = $params['sw_lat'] ?? null;
        $swLon = $params['sw_lon'] ?? null;

        $excludedPropertyIds = $params['excluded_property_ids'] ?? null;

        $params['with_folder'] = true;
        if ($neLat && $neLon && $swLat && $swLon) {
            $params['with_folder'] = false;
        }
        $data = $this->buildSearchQuery($params, $excludedPropertyIds);
        if ($neLat && $neLon && $swLat && $swLon) {
            $data = $data->where(function($query) use($neLat, $neLon, $swLat, $swLon) {
                $query->whereRaw('
                    ((' . $swLat . ' < ' . $neLat . ' AND location_latitude BETWEEN ' . $swLat . ' AND ' . $neLat . ') OR (' . $neLat . ' < ' . $swLat . ' AND location_latitude BETWEEN ' . $neLat . ' AND ' . $swLat . '))
                    AND
                    ((' . $swLon . ' < ' . $neLon . ' AND location_longitude BETWEEN ' . $swLon . ' AND ' . $neLon . ') OR (' . $neLon . ' < ' . $swLon . ' AND location_longitude BETWEEN ' . $neLon . ' AND ' . $swLon . '))
                ');
            });
        }

        $count = $data->count();

        $data = $data->orderBy($orderBy, $order);

        $data = $data->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

        $result = array(
            'total'          => $count,
            'page'           => $page,
            'count_per_page' => $perPage,
            'count'          => $data->count(),
            'data'           => $data,
        );

        return $result;
    }

    public function getSearchCount(array $params)
    {
        $lat = $params['lat'] ?? null;
        $lon = $params['lon'] ?? null;
        $radius = $params['radius'] ?? 10;
        $excludedPropertyIds = $params['excluded_property_ids'] ?? null;

        $data = $this->buildSearchQuery($params, $excludedPropertyIds);

        $count_flag = false;
        if ($lat && $lon) {
            $data = $data->selectRaw('*, ( 3959 * acos( cos( radians(?) ) *
                                cos( radians( location_latitude	 ) )
                                * cos( radians( location_longitude ) - radians(?)
                                ) + sin( radians(?) ) *
                                sin( radians( location_latitude	 ) ) )
                                ) AS distance', [$lat, $lon, $lat])
                        ->havingRaw("distance < ?", [$radius]);
            $distanceResult = $data->get();
            $count_flag = true;
        }

        $count = $count_flag ? count($distanceResult) : $data->count();

        return $count;
    }

    public function getDailyAddedCountInfos()
    {
        $data = $this->model->whereDate('created_at', Carbon::today());
        $data = $data->select('user_id', DB::raw('count(*) as total'));
        $data = $data->groupBy('user_id');
        $data = $data->get();

        return $data;
    }

    public function searchAndUpdate($params, $updateData, $excludedPropertyIds)
    {
        $data = $this->buildSearchQuery($params, $excludedPropertyIds);

        return $data->update($updateData);
    }

    public function searchAndDelete($params, $excludedPropertyIds)
    {
        $data = $this->buildSearchQuery($params, $excludedPropertyIds);
        $data = $data->whereNotIn('id', function($query) {
            $query->select('property_id')->from('sms_campaign_properties');
        });
        $data = $data->whereNotIn('id', function($query) {
            $query->select('property_id')->from('mail_campaign_properties');
        });

        return $data->delete();
    }

    public function searchAndDeleteSmsCampaignPropertiesCancelled($params, $excludedPropertyIds)
    {
        $data = $this->buildSearchQuery($params, $excludedPropertyIds);
        $smsCampaignProperty = SmsCampaignProperty::whereHas('smsCampaign', function($query) {
            $query->whereNotIn('finished', [0, 1]);
        });
        $smsCampaignProperty = $smsCampaignProperty->whereIn('property_id', $data->select('id'));

        return $smsCampaignProperty->delete();
    }

    public function searchAndDeleteMailCampaignPropertiesCancelled($params, $excludedPropertyIds)
    {
        $data = $this->buildSearchQuery($params, $excludedPropertyIds);
        $mailCampaignProperty = MailCampaignProperty::whereHas('mailCampaign', function($query) {
            $query->whereNotIn('finished', [0, 1]);
        });
        $mailCampaignProperty = $mailCampaignProperty->whereIn('property_id', $data->select('id'));

        return $mailCampaignProperty->delete();
    }

    public function removeProperties($propertyIds)
    {
        $data = $this->model->whereIn('id', $propertyIds);
        $data = $data->whereNotIn('id', function($query) {
            $query->select('property_id')->from('sms_campaign_properties');
        });
        $data = $data->whereNotIn('id', function($query) {
            $query->select('property_id')->from('mail_campaign_properties');
        });

        return $data->delete();
    }

    public function searchAndGet($params, $excludedPropertyIds, $page, $pageSize = 100)
    {
        $data = $this->buildSearchQuery($params, $excludedPropertyIds);
        return $data->skip(($page - 1) * $pageSize)
            ->take($pageSize)
            ->get();
    }

    public function getPropertiesByUserIdAndPhoneNumber($userId, $phoneNumber)
    {
        $data = $this->model->where('user_id', $userId);
        $data = $data->with('phones');
        $data = $data->whereHas('phones', function($query) use($phoneNumber) {
            $query->where('phone_number', $phoneNumber);
        });

        return $data->get();
    }

    public function getNotSkipTracedCount($params, $teamId, $excludedPropertyIds = null)
    {
        $propertyIds = $params['property_ids'] ?? null;
        $filter = $params['filter'] ?? null;

        if ($propertyIds) {
            $data = $this->model->whereIn('id', $propertyIds);
        } else if ($filter) {
            $filter['team_id'] = $teamId;
            $data = $this->buildSearchQuery($filter, $excludedPropertyIds);
        }

        // $data = $data->whereNull('skip_tracing_date');
        $data = $data->where(function($query) {
            $query = $query->doesnthave('phones');
            $query = $query->orWhereHas('phones', function($q) {
                $q = $q->where('type', '!=', 'Mobile');
            });
        });

        return $data->count();
    }

    public function buildSearchQuery($params, $excludedPropertyIds = null)
    {
        $search = $params['search'] ?? '';
        $userId = $params['userId'] ?? null;
        $teamId = $params['team_id'] ?? null;
        $folderId = $params['folder_id'] ?? null;
        $stateId = $params['state_id'] ?? null;
        $drivingRouteId = $params['driving_route_id'] ?? null;
        $status = $params['status'] ?? null;
        $skipTraced = $params['skip_traced'] ?? null;
        $ownerOccupied = $params['owner_occupied'] ?? null;
        $smsCampaignId = $params['sms_campaign_id'] ?? null;
        $mailCampaignId = $params['mail_campaign_id'] ?? null;
        $createdAt = $params['created_at'] ?? null;
        $tags = $params['tags'] ?? null;
        $withImages = $params['with_images'] ?? false;
        $withFolder = $params['with_folder'] ?? false;

        $data = $this->model;
        if ($folderId) {
            $data = $data->whereHas('folder', function($query) use($folderId) {
                $query->where('folder_id', '=', $folderId);
            });
        }
        if ($stateId) {
            $data = $data->whereHas('state', function($query) use($stateId) {
                $query->where('state_id', '=', $stateId);
            });
        }

        if ($drivingRouteId) {
            $data = $data->whereHas('drivingRoute', function($query) use($drivingRouteId) {
                $query->where('driving_route_id', '=', $drivingRouteId);
            });
        }

        if ($smsCampaignId) {
            $data = $data->with('smsCampaignProperties');
            $data = $data->whereHas('smsCampaignProperties', function($query) use($smsCampaignId) {
                $query->where('sms_campaign_id', '=', $smsCampaignId);
            });
        }

        if ($mailCampaignId) {
            $data = $data->with('mailCampaignProperties');
            $data = $data->whereHas('mailCampaignProperties', function($query) use($mailCampaignId) {
                $query->where('mail_campaign_id', '=', $mailCampaignId);
            });
        }

        // $data = $data->with('folder')
        //     ->with('images')
        //     ->with('emails')
        //     ->with('phones')
        //     ->with('drivingRoute');
        if ($withFolder) {
            $data = $data->with('folder');
        }
        if ($withImages) {
            $data = $data->with('images');
        }
        if ($search) {
            $data = $data->where(function($query) use($search) {
                $query->whereRaw('lower(address1) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(address2) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(Current_Owner_Name) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(Owner1FirstName) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(Owner1LastName) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(Owner2Firstname) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(Owner2LastName) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(CO_Mail_Street_Address) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(CO_Mailing_City) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(CO_Mailing_State) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(CO_Mailing_Zip_Code) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(CO_Mailing_Zip_Plus4Code) like (?)', '%' . strtolower($search) . '%')
                    // ->orWhereRaw('lower(Mailing_Zip5) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(Site_Address) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(Site_City) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(Site_State) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(Site_Zip5) like (?)', '%' . strtolower($search) . '%')
                    ->orWhereRaw('lower(Site_Zip4) like (?)', '%' . strtolower($search) . '%');
            });
        }

        if ($status) {
            if (is_array($status)) {
                $data = $data->where(function($query) use($status) {
                    foreach ($status as $propertyState) {
                        $query = $query->orWhere('status', $propertyState);
                    }
                });
            } else {
                $data = $data->where('status', $status);
            }
        }
        if ($userId) {
            $data = $data->where('user_id', $userId);
        }
        if ($teamId) {
            $data = $data->where('team_id', $teamId);
        }
        if ($skipTraced === 'Y') {
            $data = $data->whereNotNull('skip_tracing_date');
        } else if ($skipTraced === 'N') {
            $data = $data->whereNull('skip_tracing_date');
        }
        if ($ownerOccupied === 'Y') {
            $data = $data->where(function($query) use ($ownerOccupied) {
                $query = $query
                    ->where('Owner_Occupied', $ownerOccupied)
                    ->orWhere('Owner_Occupied', "1")
                    ->orWhere('Owner_Occupied', "true");
            });
        } else if ($ownerOccupied === 'N') {
            $data = $data->where(function($query) {
                $query = $query
                    ->whereNull('Owner_Occupied')
                    ->orWhere('Owner_Occupied', "0")
                    ->orWhere('Owner_Occupied', "false");
            });
        }
        if ($createdAt) {
            $data = $data->whereDate('created_at', $createdAt);
        }
        if ($tags) {
            $data = $data->whereHas('tags', function ($query) use ($tags) {
                $query = $query->whereIn('tag_id', $tags);
            });
        }

        if ($excludedPropertyIds) {
            $data = $data->whereNotIn('id', $excludedPropertyIds);
        }

        return $data;
    }
}

