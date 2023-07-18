<?php
namespace App\Http\Helpers;

/**
 * Class PhoneNumberHelper
 *
 * @package App\Http\Helpers
 */
class PhoneNumberHelper
{
    public static function format($phoneNumber)
    {
        $phoneNumber = str_replace("(", "", $phoneNumber);
        $phoneNumber = str_replace(" ", "", $phoneNumber);
        $phoneNumber = str_replace(")", "", $phoneNumber);
        $phoneNumber = str_replace("-", "", $phoneNumber);
        if (substr($phoneNumber, 0, 2) !== "+1") {
            $phoneNumber = "+1" . $phoneNumber;
        }

        return $phoneNumber;
    }

    public static function formatToSimple($phoneNumber)
    {
        if (substr($phoneNumber, 0, 2) === '+1') {
            $phoneNumber = substr($phoneNumber, 2);
        }
        return preg_replace("/[^0-9]/", "", $phoneNumber);
    }
}
