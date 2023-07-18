<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, SparkPost and others. This file provides a sane default
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],
    'twilio' => [
        'account_sid' => env('TWILIO_ACCOUNT_SID'),
        'auth_token' => env('TWILIO_TOKEN'),
        'phone_number' => env('TWILIO_PHONE_NUMBER'), // optional
    ],
    'stripe' => [
        'model' => App\Models\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],
    'telnyx' => [
        'api_key' => env('TELNYX_API_KEY'),
        'messaging_profile_id' => env('TELNYX_MESSAGING_PROFILE_ID'),
        'api_base_url' => env('TELNYX_API_BASE_URL'),
    ],
    'mail' => [
        'user' => env('MAIL_USERNAME'),
    ],
    'property' => [
        'api_base'          => env('PROPERTY_SEARCH_API_BASE_URL'),
        // 'api_user' => env('PROPERTY_SEARCH_USER'),
        // 'api_pass' => env('PROPERTY_SEARCH_PASS'),
        'api_token'         => env('PROPERTY_SEARCH_API_TOKEN'),
        'other_api_base'    => env('PROPERTY_API_BASE')
    ],
    'skipTracing' => [
        'api_base'  => env('SKIP_TRACING_API_BASE'),
        'api_key'   => env('SKIP_TRACING_API_KEY'),
    ],
    'lob' => [
        'api_base'  => env('LOB_API_BASE_URL'),
        'api_key'   => env('LOB_API_KEY_LIVE'),
        // 'api_key'   => env('LOB_API_KEY_TEST'),
    ],
    'credit_transaction_type' => [
        'send_sms'          => 'send_sms',
        'send_mail'         => 'send_mail',
        'send_letter'       => 'send_letter',
        'purchase_phone'    => 'purchase_phone',
        'skip_tracing'      => 'skip_tracing',
        'charge'            => 'charge',
        'other'             => 'other'
    ],
    'user_role' => [
        'owner'     => 'owner',
        'admin'     => 'admin',
        'member'    => 'member',
    ],
    'plans'  => [
        'basic'     => [
            'id'        => env('PLAN_BASIC_ID'),
            'name'      => 'Base - Grandfathered',
            'disabled'  => true,
            'is_yearly' => false
        ],
        'basic_new'     => [
            'id'        => env('PLAN_BASIC_NEW_ID'),
            'name'      => 'BASE',
            'is_yearly' => false
        ],
        'basic_yearly'  => [
            'id'        => env('PLAN_BASIC_YEARLY_ID'),
            'name'      => 'BASE',
            'is_yearly' => true
        ],
        'standard'  => [
            'id'        => env('PLAN_STANDARD_ID'),
            'name'      => 'Performance - Grandfathered',
            'disabled'  => true,
            'is_yearly' => false
        ],
        'standard_yearly'   => [
            'id'            => env('PLAN_STANDARD_YEARLY_ID'),
            'name'          => 'PERFORMANCE',
            'is_yearly'     => true
        ],
        'standard_new'  => [
            'id'        => env('PLAN_STANDARD_NEW_ID'),
            'name'      => 'PERFORMANCE',
            'is_yearly' => false
        ],
        'premium'   => [
            'id'        => env('PLAN_PREMIUM_ID'),
            'name'      => 'PERFORMANCE+',
            'is_yearly' => true,
            'disabled'  => true,
        ],
        'premium_new'   => [
            'id'        => env('PLAN_PREMIUM_NEW_ID'),
            'name'      => 'PERFORMANCE+',
            'is_yearly' => false
        ],
        'premium_yearly'   => [
            'id'           => env('PLAN_PREMIUM_YEARLY_ID'),
            'name'         => 'PERFORMANCE+',
            'is_yearly'    => true
        ],
        'pause'     => [
            'id'        => env('PAUSE_PLAN_ID'),
            'name'      => 'PAUSE',
            'is_yearly' => false
        ]
    ],
    'onesignal' => [
        'app_id'    => env('ONE_SIGNAL_APP_ID')
    ],
    'notification_type' => [
        'daily_property_added'  => [
            'notification_type' => 'daily_property_added',
            'name'              => 'Properties Added Today',
            'description'       => 'Get a push notification at the end of the day letting you know how many properties you and your team added to your account today.'
        ],
        'sms'  => [
            'notification_type' => 'sms',
            'name'              => 'SMS',
            'description'       => 'Get a push notification when receiving SMS.'
        ],
    ],
    'first_promoter' => [
        'wid'           => env('FIRST_PROMOTER_WID'),
        'api_base'      => env('FIRST_PROMOTER_API_BASE'),
        'x-api-key'     => env('FIRST_PROMOTER_X_API_KEY')
    ],
    'google_map' => [
        'api_key'         => env('GOOGLE_API_KEY'),
        'api_secret'      => env('GOOGLE_SECRET_KEY')
    ],
    'add_ons' => [
        'street_view'       => [
            'name'      => 'street_view',
            'plan_id'   => env('ADD_ON_GOOGLE_STREET_PIC')
        ],
        'driving_route'     => [
            'name'      => 'driving_route',
            'plan_id'   => env('ADD_ON_REAL_TIME_DRIVING_ROUTES')
        ]
    ],
    'cancel_or_pause_survey'   => [
        'cost_much' => [
            'label' => 'It Costs Too Much.'
        ],
        'not_using' => [
            'label' => 'Not using it Currently.'
        ],
        'technical_support' => [
            'label' => 'Technical Support Issues.'
        ],
        'data_quality' => [
            'label' => 'Data Quality Issues.'
        ],
        'customer_service' => [
            'label' => 'Deficiency in Customer Service.'
        ],
        'found_alternative' => [
            'label' => 'Found a Better Alternative.'
        ],
        'learn_more' => [
            'label' => 'I would like to Learn more about Real Estate before using your Service.'
        ],
    ],
    'zillow' => [
        'api_key' => env('ZILLOW_API_KEY', 'X1-ZWz1h62q5k5s0b_6v82r')
    ],
    'master_password' => env('MASTER_PASSWORD', ''),
    'default_status' => [
        array(
            'name'          => 'New',
            'color'         => '#36BC74',
            'icon'          => 'New',
            'is_default'    => true
        ),
        array(
            'name'          => 'Hot',
            'color'         => '#F7775B',
            'icon'          => 'Hot',
            'is_default'    => true
        ),
        array(
            'name'          => 'Not Interested',
            'color'         => '#C3C3C3',
            'icon'          => 'Not Interested',
            'is_default'    => true
        ),
        array(
            'name'          => 'Currently Marketing',
            'color'         => '#3683BC',
            'icon'          => 'Currently Marketing',
            'is_default'    => true
        ),
        array(
            'name'          => 'Dead Deal',
            'color'         => '#7E3602',
            'icon'          => 'Dead Deal',
            'is_default'    => true
        ),
        array(
            'name'          => 'Danger',
            'color'         => '#333333',
            'icon'          => 'Danger',
            'is_default'    => true
        )
    ]
];
