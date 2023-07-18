<?php

namespace App\Services;

use GuzzleHttp\Client;
use App\Repositories\PropertyRepository;
use ArrayHelpers\Arr;
use Log;

/**
 * Class PropertyService
 *
 * @package App\Http\Services
 */
class PropertyService extends BaseService
{
    protected $repository;

    /**
     * PropertyService constructor.
     *
     * @param PropertyRepository $propertyRepository
     */
    public function __construct(PropertyRepository $propertyRepository)
    {
        $this->repository = $propertyRepository;
    }

    public function read($id, array $relationships = array('folder', 'images', 'emails', 'phones', 'drivingRoute', 'tags', 'state'))
    {
        return $this->repository->find($id, $relationships);
    }

    public function filterByRegion($data)
    {
        return $this->repository->filterByRegion($data);
    }

    public function getSearchCount($data)
    {
        return $this->repository->getSearchCount($data);
    }

    public function getNotSkipTracedCount($data, $teamId, $excludedPropertyIds = null)
    {
        return $this->repository->getNotSkipTracedCount($data, $teamId, $excludedPropertyIds);
    }

    public function propertySearch($data)
    {
        try {
            $client = new Client();
            $apiBase = config('services.property.api_base');
            $apiToken = config('services.property.api_token');
            $headers = [
                'Authorization' => 'Bearer ' . $apiToken,
                'Accept'        => 'application/json',
                'Content-Type'  => 'application/json'
            ];
            $response = $client->request('POST', $apiBase . '/search-properties', [
                'headers'   => $headers,
                'json'      => $data
            ]);

            if ($response->getStatusCode() === 200) {
                $response = json_decode($response->getBody(), true);
                $results = $response['results'];
                $properties = $results['properties'];
                $meta = $results['meta'];

                $returnResult = [];
                foreach ($properties as $property) {
                    $returnResult []= $this->buildPropertyInfos($property);
                }
                $result = array(
                    'items'             => $returnResult,
                    'total'             => $meta['resultsFound']
                );
                return $result;
            }
        } catch (\Exception $e) {
            echo $e->getMessage();
        }

        return 404;
    }

    public function propertySearchByAddress($data)
    {
        try {
            $client = new Client();
            $apiBase = config('services.property.api_base');
            $apiToken = config('services.property.api_token');
            $headers = [
                'Authorization' => 'Bearer ' . $apiToken,
                'Accept'        => 'application/json',
                'Content-Type'  => 'application/json'
            ];
            $response = $client->request('POST', $apiBase . '/get-property', [
                'headers'   => $headers,
                'json'      => $data
            ]);

            if ($response->getStatusCode() === 200) {
                $response = json_decode($response->getBody(), true);
                $status = $response['status'];
                if ($status['code'] !== 200) {
                    return 404;
                }
                $result = $response['result'];
                if (array_key_exists('property', $result)) {
                    $property = $result['property'];
                    $result = $this->buildPropertyInfos($property);
                    return $result;
                }
            }
        } catch (\Exception $e) {
            echo $e->getMessage();
        }

        return 404;
    }

    public function propertySearchByAddressBulk($data)
    {
        try {
            $client = new Client();
            $apiBase = config('services.property.api_base');
            $apiToken = config('services.property.api_token');
            $headers = [
                'Authorization' => 'Bearer ' . $apiToken,
                'Accept'        => 'application/json',
                'Content-Type'  => 'application/json'
            ];
            $response = $client->request('POST', $apiBase . '/get-properties', [
                'headers'   => $headers,
                'json'      => $data
            ]);

            if ($response->getStatusCode() === 200) {
                $response = json_decode($response->getBody(), true);
                $status = $response['status'];
                if ($status['code'] !== 200) {
                    return 404;
                }
                $results = $response['results'];
                if (array_key_exists('properties', $results)) {
                    $result = [];
                    foreach ($results['properties'] as $property) {
                        $result []= $this->buildPropertyInfos($property);
                    }

                    return $result;
                }
            }
        } catch (\Exception $e) {
            echo $e->getMessage();
        }

        return 404;
    }

    public function normalizeAddressBulk($data)
    {
        try {
            $client = new Client();
            $apiBase = config('services.property.other_api_base');
            $apiToken = config('services.property.api_token');
            $headers = [
                'Authorization' => 'Bearer ' . $apiToken,
                'Accept'        => 'application/json',
                'Content-Type'  => 'application/json'
            ];
            $response = $client->request('POST', $apiBase . '/address/normalize-addresses', [
                'headers'   => $headers,
                'json'      => $data
            ]);

            if ($response->getStatusCode() === 200) {
                $response = json_decode($response->getBody(), true);
                $status = $response['status'];
                if ($status['code'] !== 200) {
                    return null;
                }
                $results = Arr::get($response, 'results', []);
                return $results['addresses'] ?? null;
            }
        } catch (\Exception $e) {
            echo $e->getMessage();
        }

        return null;
    }

    public function getPhoneNumbers($data)
    {
        try {
            $client = new Client();
            $apiBase = config('services.property.other_api_base');
            $apiToken = config('services.property.api_token');
            $headers = [
                'Authorization' => 'Bearer ' . $apiToken,
                'Accept'        => 'application/json',
                'Content-Type'  => 'application/json'
            ];
            $response = $client->request('POST', $apiBase . '/phone-number/get-phone-numbers', [
                'headers'   => $headers,
                'json'      => $data
            ]);

            if ($response->getStatusCode() === 200) {
                $response = json_decode($response->getBody(), true);
                $status = $response['status'];
                if ($status['code'] !== 200) {
                    return null;
                }
                $result = Arr::get($response, 'results', []);
                return Arr::get($result, 'phoneNumbers', null);
            }
        } catch (\Exception $e) {
            return null;
        }

        return null;
    }

    public function getDailyAddedCountInfos()
    {
        return $this->repository->getDailyAddedCountInfos();
    }

    public function reverseGeocode($latitude, $longitude)
    {
        try {
            $client = new Client();
            // $apiBase = config('services.property.api_base');
            $apiToken = config('services.property.api_token');
            $headers = [
                'Authorization' => 'Bearer ' . $apiToken,
                'Accept'        => 'application/json',
                'Content-Type'  => 'application/json'
            ];
            $response = $client->request('POST', 'https://reicoreapi.com/v1/geocoding/reverse-geocode', [
                'headers'   => $headers,
                'json'      => array(
                    'request'   => array(
                        'latitude'  => $latitude,
                        'longitude' => $longitude
                    )
                )
            ]);

            if ($response->getStatusCode() === 200) {
                $response = json_decode($response->getBody(), true);
                $status = $response['status'];
                if ($status['code'] === 200) {
                    $result = $response['result'];
                    return $result['address'];
                }
            }

            return null;
        } catch (\Exception $ex) {
            return null;
        }
    }

    public function searchAndUpdate($filter, $data, $excludedPropertyIds)
    {
        return $this->repository->searchAndUpdate($filter, $data, $excludedPropertyIds);
    }

    public function searchAndDelete($filter, $excludedPropertyIds = null)
    {
        return $this->repository->searchAndDelete($filter, $excludedPropertyIds);
    }

    public function removeProperties($propertyIds)
    {
        return $this->repository->removeProperties($propertyIds);
    }

    public function searchAndGet($filter, $excludedPropertyIds, $page, $pageSize = 100)
    {
        return $this->repository->searchAndGet($filter, $excludedPropertyIds, $page, $pageSize);
    }

    public function searchAndDeleteSmsCampaignPropertiesCancelled($params, $excludedPropertyIds)
    {
        return $this->repository->searchAndDeleteSmsCampaignPropertiesCancelled($params, $excludedPropertyIds);
    }

    public function searchAndDeleteMailCampaignPropertiesCancelled($params, $excludedPropertyIds)
    {
        return $this->repository->searchAndDeleteMailCampaignPropertiesCancelled($params, $excludedPropertyIds);
    }

    public function getPropertiesByUserIdAndPhoneNumber($userId, $phoneNumber)
    {
        return $this->repository->getPropertiesByUserIdAndPhoneNumber($userId, $phoneNumber);
    }

    protected function buildPropertyInfos($property)
    {
        $address2 = "";
        if (Arr::get($property, 'currentOwner.mailingAddress.street', null)) {
            $address2 .= $property['currentOwner']['mailingAddress']['street'] . ', ';
        }
        if (Arr::get($property, 'currentOwner.mailingAddress.city', null)) {
            $address2 .= $property['currentOwner']['mailingAddress']['city'] . ', ';
        }
        if (Arr::get($property, 'currentOwner.mailingAddress.state', null)) {
            $address2 .= $property['currentOwner']['mailingAddress']['state'] . ' ';
        }
        if (Arr::get($property, 'currentOwner.mailingAddress.zip', null)) {
            $address2 .= $property['currentOwner']['mailingAddress']['zip'];
        }

        $address1 = "";
        if (Arr::get($property, 'address.street', null)) {
            $address1 .= $property['address']['street'] . ', ';
        }
        if (Arr::get($property, 'address.city', null)) {
            $address1 .= $property['address']['city'] . ', ';
        }
        if (Arr::get($property, 'address.state', null)) {
            $address1 .= $property['address']['state'] . ' ';
        }
        if (Arr::get($property, 'address.zip', null)) {
            $address1 .= $property['address']['zip'];
        }

        $currentOwnerNames = Arr::get($property, 'currentOwner.names', null);
        $mortgages = Arr::get($property, 'mortgages', null);
        $result = array(
            'Assessors_Parcel_Number'       => Arr::get($property, 'ids.apn', null),
            'Current_Owner_Name'            => Arr::get($property, 'currentOwner.fullName', null),
            'CO_Mail_Street_Address'        => Arr::get($property, 'currentOwner.mailingAddress.street', null),
            'CO_Mailing_City'               => Arr::get($property, 'currentOwner.mailingAddress.city', null),
            'CO_Mailing_State'              => Arr::get($property, 'currentOwner.mailingAddress.state', null),
            'CO_Mailing_Zip_Code'           => Arr::get($property, 'currentOwner.mailingAddress.zip', null),
            'CO_Mailing_Zip_Plus4Code'      => Arr::get($property, 'currentOwner.mailingAddress.zipPlus4', null),
            'CO_Unit_Number'                => Arr::get($property, 'currentOwner.mailingAddress.unitNumber', null),
            'Mail_Care_Of_Name_Indicator'   => Arr::get($property, 'building.mainBuildingAreaIndicator', null),
            'Owner_Occupied'                => Arr::get($property, 'currentOwner.ownerOccupied', null),
            'Owner1FirstName'               => $currentOwnerNames ? (count($currentOwnerNames) > 0 ? Arr::get($currentOwnerNames[0], 'first', null) : null) : null,
            'Owner1LastName'                => $currentOwnerNames ? (count($currentOwnerNames) > 0 ? Arr::get($currentOwnerNames[0], 'last', null) : null) : null,
            'Owner2FirstName'               => $currentOwnerNames ? (count($currentOwnerNames) > 1 ? Arr::get($currentOwnerNames[1], 'first', null) : null) : null,
            'Owner2LastName'                => $currentOwnerNames ? (count($currentOwnerNames) > 1 ? Arr::get($currentOwnerNames[1], 'last', null) : null) : null,
            'Length_of_Residence_Months'    => Arr::get($property, 'currentOwner.lengthOfResidenceMonths', null),
            'LSale_Price'                   => Arr::get($property, 'sale.lastSale.price', null),
            'LSale_Recording_Date'          => Arr::get($property, 'sale.lastSale.recordingDate', null),
            'LValid_Price'                  => Arr::get($property, 'sale.lastSale.price', null),
            'Total_Assessed_Value'          => Arr::get($property, 'assessment.totalAssessedValue', null),
            'Assessment_Year'               => Arr::get($property, 'assessment.recordingDateFromAssessment', null),
            'LotSize_Square_Feet'           => Arr::get($property, 'lot.lotSizeSquareFeet', null),
            'Building_Area'                 => Arr::get($property, 'building.totalBuildingAreaSquareFeet', null),
            'No_of_Stories'                 => Arr::get($property, 'building.numberOfStories', null),
            'Number_of_Baths'               => Arr::get($property, 'building.numberOfBaths', null),
            'Number_of_Bedrooms'            => Arr::get($property, 'building.numberOfBedrooms', null),
            'Mtg01_lender_name_beneficiary' => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'lenderName', null) : null) : null,
            'Mtg01_recording_date'          => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'recordingDate', null) : null) : null,
            'Mtg01_Loan_Amount'             => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'loanAmount', null) : null) : null,
            'Mtg01_loan_type'               => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'loanType', null) : null) : null,
            'Mtg01_interest_rate'           => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'interestRate', null) : null) : null,
            'Mtg01_due_date'                => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'dueDate', null) : null) : null,
            'Mtg01_Loan_Term_Years'         => null,
            'Mtg01_Equity_Credit_Line'      => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'equityCreditLine', null) : null) : null,
            'Mtg02_lender_name_beneficiary' => $mortgages ? (count($mortgages) > 1 ? Arr::get($mortgages[1], 'lenderName', null) : null) : null,
            'Mtg02_recording_date'          => $mortgages ? (count($mortgages) > 1 ? Arr::get($mortgages[1], 'recordingDate', null) : null) : null,
            'Mtg02_Loan_Amount'             => $mortgages ? (count($mortgages) > 1 ? Arr::get($mortgages[1], 'loanAmount', null) : null) : null,
            'Mtg02_loan_type'               => $mortgages ? (count($mortgages) > 1 ? Arr::get($mortgages[1], 'loanType', null) : null) : null,
            'Mtg02_interest_rate'           => $mortgages ? (count($mortgages) > 1 ? Arr::get($mortgages[1], 'interestRate', null) : null) : null,
            'Mtg02_due_date'                => $mortgages ? (count($mortgages) > 1 ? Arr::get($mortgages[1], 'dueDate', null) : null) : null,
            'Mtg02_Loan_Term_Years'         => null,
            'Mtg02_Equity_Credit_Line'      => $mortgages ? (count($mortgages) > 1 ? Arr::get($mortgages[1], 'equityCreditLine', null) : null) : null,
            'Mtg02_Curr_Est_Bal'            => $mortgages ? (count($mortgages) > 1 ? Arr::get($mortgages[1], 'currentEstimatedInterestRate', null) : null) : null,
            'Total_Open_Lien_Count'         => Arr::get($property, 'lien.totalOpenLienCount', null),
            'Total_Open_Lien_Balance'       => Arr::get($property, 'lien.totalOpenLienBalance', null),
            'Current_Est_LTV_Combined'      => Arr::get($property, 'valueAndEquity.ltvCurrentEstimatedCombined', null),
            // 'Current_Est_Equity_Dollars'    => Arr::get($property, 'valueAndEquity.equityCurrentEstimatedBalance', null),
            'Current_Est_Equity_Dollars'    => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'currentEstimatedBalance', null) : null) : null,
            'Current_Est_Equity_Dollars_1'  => $mortgages ? (count($mortgages) > 1 ? Arr::get($mortgages[1], 'currentEstimatedBalance', null) : null) : null,
            'Current_Est_Equity_Dollars_2'  => $mortgages ? (count($mortgages) > 2 ? Arr::get($mortgages[2], 'currentEstimatedBalance', null) : null) : null,
            'Current_Foreclosure_Status'    => Arr::get($property, 'foreclosure.status', null),
            'Foreclosure_Recording_Date'    => Arr::get($property, 'foreclosure.recordingDate', null),
            'Foreclosure_filing_date'       => Arr::get($property, 'foreclosure.filingDate', null),
            'Foreclosure_Auction_Date'      => Arr::get($property, 'foreclosure.auctionDate', null),
            'ESTIMATED_VALUE'               => Arr::get($property, 'valueAndEquity.estimatedValue', null),
            'CONFIDENCE_SCORE'              => Arr::get($property, 'valueAndEquity.confidenceScore', null),
            'QVM_asof_Date'                 => Arr::get($property, 'valueAndEquity.asOfDate', null),
            'location_longitude'            => Arr::get($property, 'address.longitude', null),
            'location_latitude'             => Arr::get($property, 'address.latitude', null),
            'address1'                      => $address1,
            'address2'                      => $address2,
            'Mailing_Zip5'                  => null,
            'Site_Address'                  => Arr::get($property, 'address.street', null),
            'Site_City'                     => Arr::get($property, 'address.city', null),
            'Site_State'                    => Arr::get($property, 'address.state', null),
            'Site_Zip5'                     => Arr::get($property, 'address.zip', null),
            'Site_Zip4'                     => Arr::get($property, 'address.zipPlus4', null),
            'Sale_Date'                     => Arr::get($property, 'sale.lastTransfer.saleDate', null),
            'Sale_Price'                    => Arr::get($property, 'sale.lastTransfer.price', null),
            'Mortgage_Amount'               => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'loanAmount', null) : null) : null,
            'Lender_Name'                   => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'lenderName', null) : null) : null,
            'Assessed_Value'                => Arr::get($property, 'assessment.totalAssessedValue', null),
            'Improvement_Value'             => Arr::get($property, 'assessment.marketValueImprovement', null),
            'Land_Value'                    => Arr::get($property, 'assessment.assessedLandValue', null),
            'Total_Value'                   => Arr::get($property, 'assessment.marketValueLand', null),
            'Year_Built'                    => Arr::get($property, 'building.yearBuilt', null),
            'Baths'                         => Arr::get($property, 'building.numberOfBaths', null),
            'Bedrooms'                      => Arr::get($property, 'building.numberOfBedrooms', null),
            'Square_Footage'                => Arr::get($property, 'building.totalBuildingAreaSquareFeet', null),
            'Acreage'                       => Arr::get($property, 'building.totalBuildingAreaSquareFeet', null),
            'address_hash'                  => Arr::get($property, 'ids.addressHash', null),
            'Property_Type'                 => Arr::get($property, 'building.standardizedLandUse', null),
            'Owner_Type'                    => Arr::get($property, 'currentOwner.ownerStatusType', null),
            'Last_Sale_Date'                => Arr::get($property, 'currentOwner.ownershipStartDate', null),
            'Number_of_Units'               => Arr::get($property, 'building.numberOfUnits', null),
            'pool'                          => Arr::get($property, 'building.pool', null),
            'fireplace'                     => Arr::get($property, 'building.fireplace', null),
            'Air_Conditioning_Source'       => Arr::get($property, 'building.airConditioningSource', null),
            'Air_Conditioning_Type'         => Arr::get($property, 'building.airConditioningType', null),
            'Construction_Type'             => Arr::get($property, 'building.constructionType', null),
            'Heating_Type'                  => Arr::get($property, 'building.heating', null),
            'Garage_Type'                   => Arr::get($property, 'building.garageType', null),
            'Roof_Type'                     => Arr::get($property, 'building.roofCover', null),
            'foundation'                    => Arr::get($property, 'building.foundation', null),
            'Number_of_Garages'             => Arr::get($property, 'building.garageCars', null),
            'property_class'                => Arr::get($property, 'building.buildingClass', null),
            'zoning'                        => Arr::get($property, 'building.zoningCode', null),
            'Lot_Size_Acres'                => Arr::get($property, 'lot.lotSizeAcres', null),
            'Legal_Description'             => Arr::get($property, 'legal.legalBriefDescriptionFull', null),
            'Lot_Number'                    => Arr::get($property, 'legal.lotNumber', null),
            'subdivision'                   => Arr::get($property, 'legal.subdivisionName', null),
            'totalMarketValue'              => Arr::get($property, 'assessment.totalMarketValue', null),
            'assessmentYear'                => Arr::get($property, 'assessment.assessmentYear', null),
            'taxAmount'                     => Arr::get($property, 'tax.taxAmount', null),
            'taxYear'                       => Arr::get($property, 'tax.taxYear', null),
            'assessedImprovementValue'      => Arr::get($property, 'assessment.assessedImprovementValue', null),
            'marketValueYear'               => Arr::get($property, 'assessment.marketValueYear', null),
            'totalFinancingHistoryCount'    => Arr::get($property, 'lien.totalFinancingHistoryCount', null),
            'documentType'                  => Arr::get($property, 'sale.lastSale.documentType', null),
            'distressedSaleFlag'            => Arr::get($property, 'sale.lastSale.distressedSaleFlag', null),
            'recordingDate'                 => Arr::get($property, 'sale.lastSale.recordingDate', null),
            'age'                           => Arr::get($property, 'demographics.age', null),
            'householdSize'                 => Arr::get($property, 'demographics.householdSize', null),
            'income'                        => Arr::get($property, 'demographics.income', null),
            'netWorth'                      => Arr::get($property, 'demographics.netWorth', null),
            'discretionaryIncome'           => Arr::get($property, 'demographics.discretionaryIncome', null),
            'businessOwner'                 => Arr::get($property, 'demographics.businessOwner', null),
            'gender'                        => Arr::get($property, 'demographics.gender', null),
            'hasChildren'                   => Arr::get($property, 'demographics.hasChildren', null),
            'investmentRealEstate'          => Arr::get($property, 'demographics.investmentRealEstate', null),
            'maritalStatus'                 => Arr::get($property, 'demographics.maritalStatus', null),
            'petOwner'                      => Arr::get($property, 'demographics.petOwner', null),
            'singleParent'                  => Arr::get($property, 'demographics.singleParent', null),
            'smoker'                        => Arr::get($property, 'demographics.smoker', null),
            'vehiclesOwned'                 => Arr::get($property, 'demographics.vehiclesOwned', null),
            'religiousAffiliation'          => Arr::get($property, 'demographics.religiousAffiliation', null),
            'lenderType'                    => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'lenderType', null) : null) : null,
            'originalDateOfContract'        => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'originalDateOfContract', null) : null) : null,
            'typeFinancing'                 => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'typeFinancing', null) : null) : null,
            'lenderMailingAddress_street'   => Arr::get($property, 'lenderMailingAddress.street', null),
            'lenderMailingAddress_city'     => Arr::get($property, 'lenderMailingAddress.city', null),
            'lenderMailingAddress_state'    => Arr::get($property, 'lenderMailingAddress.state', null),
            'lenderMailingAddress_zip'      => Arr::get($property, 'lenderMailingAddress.zip', null),
            'lenderMailingAddress_zipPlus4' => Arr::get($property, 'lenderMailingAddress.zipPlus4', null),
            'lenderMailingAddress_unitNumber'       => Arr::get($property, 'lenderMailingAddress.unitNumber', null),
            'estimatedMonthlyPrincipalAndInterest'  => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'estimatedMonthlyPrincipalAndInterest', null) : null) : null,
            'estimatedMonthlyPrincipal'             => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'estimatedMonthlyPrincipal', null) : null) : null,
            'estimatedMonthlyInterest'              => $mortgages ? (count($mortgages) > 0 ? Arr::get($mortgages[0], 'estimatedMonthlyInterest', null) : null) : null,
            'vacant'                                => Arr::get($property, 'general.vacant', null),
            'request_id'                            => Arr::get($property, 'request.requestId', null)
        );

        return $result;
    }

    public function buildSearchParams($search, $data, $subscribedPlanName)
    {
        Log::info('Subscribed Plan Name ' . $subscribedPlanName);
        if (
            $subscribedPlanName !== config('services.plans.basic.name')
            && $subscribedPlanName !== config('services.plans.basic_new.name')
            && $subscribedPlanName !== config('services.plans.basic_yearly.name')
        ) {
            if (array_key_exists('dwelling_type', $data)) {
                if ($data['dwelling_type']) {
                    $search['searchCriteria']['general']['propertyTypeCategory']['equals'] = $data['dwelling_type'];
                }
            }
            if (array_key_exists('equity', $data)) {
                if ($data['equity']['min'] > 0 || $data['equity']['max'] < 100) {
                    $search['searchCriteria']['valueAndEquity']['equityPercent']['min'] = $data['equity']['min'];
                    $search['searchCriteria']['valueAndEquity']['equityPercent']['max'] = $data['equity']['max'];
                }
            }
            if (array_key_exists('tax_default', $data)) {
                if ($data['tax_default']) {
                    $search['searchCriteria']['orQuickLists'][] = 'tax-default';
                }
            }
            if (array_key_exists('tired_landlord', $data)) {
                if ($data['tired_landlord']) {
                    $search['searchCriteria']['orQuickLists'][] = 'tired-landlord';
                }
            }
            if (array_key_exists('inherited', $data)) {
                if ($data['inherited']) {
                    $search['searchCriteria']['orQuickLists'][] = 'inherited';
                }
            }
            if (array_key_exists('unknown_equity', $data)) {
                if ($data['unknown_equity']) {
                    $search['searchCriteria']['orQuickLists'][] = 'unknown-equity';
                }
            }
            if (array_key_exists('cash_buyer', $data)) {
                if ($data['cash_buyer']) {
                    $search['searchCriteria']['orQuickLists'][] = 'cash-buyer';
                }
            }
        }

        if ($subscribedPlanName !== config('services.plans.basic_new.name')) {
            if (array_key_exists('foreclosure_status', $data)) {
                if ($data['foreclosure_status']) {
                    $search['searchCriteria']['orQuickLists'][] = 'active-foreclosure';
                }
            }
        }

        if (array_key_exists('owner_status', $data)) {
            if ($data['owner_status']) {
                if ($data['owner_status'] === 1) {
                    $search['searchCriteria']['general']['ownerOccupiedStatus']['equals'] = 'Yes';
                } else {
                    $search['searchCriteria']['general']['ownerOccupiedStatus']['equals'] = $data['owner_status'];
                }
            } else if ($data['owner_status'] === 0) {
                $search['searchCriteria']['general']['ownerOccupiedStatus']['equals'] = 'No';
            }
        }

        if (array_key_exists('vacant', $data)) {
            if ($data['vacant']) {
                $search['searchCriteria']['orQuickLists'][] = 'vacant';
            }
        }

        if (array_key_exists('on_market', $data)) {
            if ($data['on_market']) {
                $onMarket = $data['on_market'];
                $onMarket = strtolower($onMarket);
                $onMarket = trim($onMarket);
                $onMarket = str_replace("_", "-", $onMarket);
                $search['searchCriteria']['quickLists'][] = $onMarket;
            }
        }

        if (array_key_exists('building', $data)) {
            if ($data['building']['min'] > 1900 || $data['building']['max'] < 2020) {
                $search['searchCriteria']['building']['yearBuilt']['min'] = $data['building']['min'];
                $search['searchCriteria']['building']['yearBuilt']['max'] = $data['building']['max'];
            }
        }

        Log::info("SEARCH = " . json_encode($search));

        return $search;
    }
}
