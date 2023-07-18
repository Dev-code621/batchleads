<?php
namespace App\Http\Helpers;

/**
 * Class UrlSignHelper
 *
 * @package App\Http\Helpers
 */
class UrlSignHelper
{
    public static function signUrl($myUrlToSign, $privateKey = 'GIb6gxz5D5GERpsXByDQBbiixks=')
    {
        // parse the url
        $url = parse_url($myUrlToSign);

        $urlPartToSign = $url['path'] . "?" . $url['query'];

        // Decode the private key into its binary format
        $decodedKey = UrlSignHelper::decodeBase64UrlSafe($privateKey);

        // Create a signature using the private key and the URL-encoded
        // string using HMAC SHA1. This signature will be binary.
        $signature = hash_hmac("sha1", $urlPartToSign, $decodedKey,  true);

        $encodedSignature = UrlSignHelper::encodeBase64UrlSafe($signature);

        return $myUrlToSign . "&signature=" . $encodedSignature;
    }

    protected static function encodeBase64UrlSafe($value)
    {
        return str_replace(array('+', '/'), array('-', '_'), base64_encode($value));
    }

    protected static function decodeBase64UrlSafe($value)
    {
        return base64_decode(str_replace(array('-', '_'), array('+', '/'), $value));
    }
}
