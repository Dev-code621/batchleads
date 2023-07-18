<?php

namespace App\Services;

use Exception;
use Lob;
use Log;

/**
 * Class LobService
 * @package App\Services
 */
class LobService
{
    protected $lob;

    /**
     * LobService constructor.
     */
    public function __construct()
    {
        $this->lob = new \Lob\Lob(config('services.lob.api_key'));
    }

    public function getTemplates()
    {
        $apiBase = config('services.lob.api_base');
        $apiKey = config('services.lob.api_key');

        $curl = curl_init($apiBase . '/templates');
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_POST, 0);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));
        curl_setopt($curl, CURLOPT_USERPWD, $apiKey);
        $response = curl_exec($curl);

        if(curl_errno($curl)){
            return null;
        }
        curl_close($curl);

        return json_decode($response, true);
    }

    public function getTemplate($templateId)
    {
        $apiBase = config('services.lob.api_base');
        $apiKey = config('services.lob.api_key');

        $curl = curl_init($apiBase . '/templates' . '/' . $templateId);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_POST, 0);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));
        curl_setopt($curl, CURLOPT_USERPWD, $apiKey);
        $response = curl_exec($curl);

        if(curl_errno($curl)){
            return null;
        }
        curl_close($curl);

        return json_decode($response, true);
    }

    public function createPostCard($data)
    {
        $name = $data['name'] ?? '';
        if (!$name) {
            Log::info('No Name = ' . $name);
            return null;
        }

        $address = $data['address'] ?? '';
        $city = $data['city'] ?? '';
        $state = $data['state'] ?? '';
        $zip = $data['zip'] ?? '';
        $description = $data['description'] ?? '';
        $frontHtml = $data['front'] ?? '';
        $backHtml = $data['back'] ?? '';
        $mergeVariables = $data['mergeVariables'] ?? null;

        $formattedAddress = null;
        try {
            $formattedAddress = $this->lob->usVerifications()->verify(
                array(
                    'primary_line' => $address,
                    'city'         => $city,
                    'state'        => $state,
                    'zip_code'     => $zip
                )
            );
        } catch (Exception $e) {
            Log::info('Address = ' . $address);
            Log::info('Address Validation Failed = ' . $e->getMessage());
            return null;
        }
        $deliverability = $formattedAddress['deliverability'];
        if ($deliverability === 'deliverable') {
            if (strlen($name) > 40) {
                $names = explode(';', $name);
                $names = explode(',', $names[0]);
                $name = substr($names[0], 0, 40);
            }
            try {
                $params = array(
                    'description'       => $description,
                    'to[name]'          => $name,
                    'to[address_line1]' => $formattedAddress['primary_line'],
                    'to[address_city]'  => $formattedAddress['components']['city'],
                    'to[address_zip]'   => $formattedAddress['components']['zip_code'],
                    'to[address_state]' => $formattedAddress['components']['state'],
                    'front'             => $frontHtml,
                    'back'              => $backHtml
                );
                if ($mergeVariables) {
                    foreach ($mergeVariables as $key => $mergeVariable) {
                        $params['merge_variables[' . $key . ']'] = $mergeVariable;
                    }
                }
                $postCard = $this->lob->postcards()->create($params);
            } catch (Exception $e) {
                Log::info('Mail Send Failed =' . $e->getMessage());
                return null;
            }

            return $postCard;
        }

        Log::info('Not Deliveriable Address = ' . $address);
        Log::info($deliverability);
        return null;
    }

    public function createLetter($data)
    {
        $name = $data['name'] ?? '';
        if (!$name) {
            Log::info('No Name = ' . $name);
            return null;
        }

        $address = $data['address'] ?? '';
        $city = $data['city'] ?? '';
        $state = $data['state'] ?? '';
        $zip = $data['zip'] ?? '';
        $description = $data['description'] ?? '';
        $frontHtml = $data['front'] ?? '';
        $mergeVariables = $data['mergeVariables'] ?? null;
        $fromAddress = $data['from_address'] ?? null;
        $fromCity = $data['from_city'] ?? null;
        $fromState = $data['from_state'] ?? null;
        $fromZip = $data['from_zip'] ?? null;
        $fromName = $data['from_name'] ?? null;

        $formattedAddress = null;
        $formattedAddressFrom = null;
        try {
            $formattedAddress = $this->lob->usVerifications()->verify(
                array(
                    'primary_line' => $address,
                    'city'         => $city,
                    'state'        => $state,
                    'zip_code'     => $zip
                )
            );
            $formattedAddressFrom = $this->lob->usVerifications()->verify(
                array(
                    'primary_line' => $fromAddress,
                    'city'         => $fromCity,
                    'state'        => $fromState,
                    'zip_code'     => $fromZip
                )
            );
        } catch (Exception $e) {
            Log::info('Address = ' . $address);
            Log::info('Address Validation Failed = ' . $e->getMessage());
            return null;
        }

        $deliverability = $formattedAddress['deliverability'];
        $deliverabilityFrom = $formattedAddressFrom['deliverability'];
        if ($deliverability === 'deliverable') {
            try {
                $params = array(
                    'description'           => $description,
                    'to[name]'              => $name,
                    'to[address_line1]'     => $formattedAddress['primary_line'],
                    'to[address_city]'      => $formattedAddress['components']['city'],
                    'to[address_zip]'       => $formattedAddress['components']['zip_code'],
                    'to[address_state]'     => $formattedAddress['components']['state'],
                    'from[name]'            => $fromName,
                    'from[address_line1]'   => $formattedAddressFrom['primary_line'],
                    'from[address_city]'    => $formattedAddressFrom['components']['city'],
                    'from[address_state]'   => $formattedAddressFrom['components']['state'],
                    'from[address_zip]'     => $formattedAddressFrom['components']['zip_code'],
                    'file'                  => $frontHtml,
                    'color'                 => true,
                );
                if ($mergeVariables) {
                    foreach ($mergeVariables as $key => $mergeVariable) {
                        $params['merge_variables[' . $key . ']'] = $mergeVariable;
                    }
                }
                $postCard = $this->lob->letters()->create($params);
            } catch (Exception $e) {
                Log::info('Failed = ' . $e->getMessage());
                return null;
            }

            return $postCard;
        }

        Log::info('Not Deliveriable Address = ' . $address);
        Log::info($deliverability);
        return null;
    }
}
