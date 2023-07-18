<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Error Language Lines
    |--------------------------------------------------------------------------
    |
    */

    'validation'    =>  [
        'fail'    =>    'Validation Failed.'
    ],
    'exception' =>  [
        'internal'          =>  'Internal Server Error.',
        'unauthenticated'   =>  'Unauthenticated.',
        'unauthorized'      =>  'You are not authorized to perform this action.'
    ],
    'user'  =>  [
        'self'  => [
            'cancelled' => 'You cancelled the account.'
        ],
        'team'  => [
            'notfound'      => 'You are not involved to any teams.',
            'notinvited'    => 'You are not invited to any teams.',
            'limit'         => 'You reached to users limit. Need to swap the plan or additional payment.'
        ],
        'link'  => [
            'invalid'   => 'The link is invalid.',
            'expired'   => 'This link had been expired.',
            'already'   => [
                'verified'  => 'Your account had already been verified.'
            ],
            'email'     => [
                'notregistered'     => 'Email is not registered.'
            ]
        ],
        'password'  => [
            'mismatching'   => 'Password is not matching.'
        ],
        'token'     => [
            'invalid'   => 'Token is invalid.'
        ],
        'verify'    => [
            'required'  => 'Need to verify your email.'
        ]
    ],
    'property'  =>  [
        'isinuse'   =>  'Property is in use.',
        'notfound'  =>  'Can not find the property.'
    ],
    'create'    =>  [
        'fail'  =>  'Create Failed.'
    ],
    'read'    =>  [
        'fail'  =>  'Read Failed.'
    ],
    'update'    =>  [
        'fail'  =>  'Update Failed.'
    ],
    'delete'    =>  [
        'fail'  =>  'Delete Failed.'
    ],
    'list'    =>  [
        'fail'  =>  'List Failed.'
    ],
    'result'    =>  [
        'notfound'  =>  'Result not found.'
    ],
    'search'    =>  [
        'fail'  =>  'Search Failed.'
    ],
    'subscribe' =>  [
        'needed'        =>  'You need to subscribe first!',
        'charge' =>  [
            'fail'  =>  'Charge Failed'
        ],
        'package'   =>  [
            'fail'  =>  'Package is not existing.'
        ],
        'fail'      =>  'Subscribe Failed.',
        'paymentmethod' =>  [
            'get'       =>  [
                'fail'  =>  'Can not get Pyment method.'
            ],
            'add'       =>  [
                'fail'  =>  'Pyment method add failed.'
            ],
            'remove'    =>  [
                'fail'  =>  'Payment method remove failed.'
            ]
        ],
        'plan'  =>  [
            'list'  =>  [
                'fail'  =>  'Failed to get user plan list.'
            ]
        ],
        'cancelled' => 'Subscription had been cancelled.',
        'pastdue'   => 'You have incompleted payment.',
        'istrial'   => 'You are on trial period.',
        'coupon'    => [
            'fail'  => 'Can not get Coupon info.'
        ]
    ],
    'credit'    =>  [
        'balance'  =>  'Credit Balance is not enough.'
    ],
    'sms'   =>  [
        'phonenumber'   =>  'You need to purchase the phonenumber first.',
        'send'          =>  [
            'fail'  => 'SMS send failed.',
            'limit' => 'You reached to the limit. Purchase additional phone number.'
        ],
        'campaign'      =>  [
            'fail'      =>  'Campaign Failed.',
            'cancel'    =>  [
                'fail'  =>  'SMS campaign cancel failed.'
            ],
            'template'  => [
                'isinuse'   => 'Template is in use.'
            ]
        ],
        'messagebox'    =>  [
            'fail'      =>  'Can not get Messagebox.'
        ],
        'messages'      =>  [
            'fail'      =>  'Can not get Messages.'
        ],
        'reset'         =>  [
            'badge'     =>  [
                'fail'  => 'Reset Badge failed.'
            ]
        ]
    ],
    'mail'  => [
        'campaign'      =>  [
            'fail'      =>  'Campaign Failed.',
            'template'  => [
                'isinuse'   => 'Template is in use.'
            ],
            'signature' => [
                'isinuse'   => 'Signature is in use.'
            ]
        ],
        'template'  =>  [
            'notfound'  =>  'Mail template not found.'
        ]
    ],
    'skiptracing'   =>  [
        'alreadyfetched'    => 'Already fetched.'
    ],
    'plan'          =>  [
        'list'      =>  [
            'fail'  =>  'Failed to get Plan list.'
        ]
    ],
    'twilio'    =>  [
        'messagingservice'  =>  [
            'create'        =>  [
                'fail'      =>  'Failed to create Messaging Service.',
                'needed'    =>  'You need to create Messaging Service.'
            ]
        ],
        'phonenumber'   =>  [
            'search'    =>  [
                'fail'  =>  'Failed to search available Phone numbers.'
            ],
            'incoming'  =>  [
                'create'    =>  [
                    'fail'  =>  'Failed to create incoming Phone number'
                ]
            ],
            'add'   =>  [
                'fail'  =>  'Failed to add Phone number.'
            ],
            'list'   =>  [
                'fail'  =>  'Can not get the phone numbers'
            ]
        ],
        'sms'       =>  [
            'send'  =>  [
                'fail'  => 'Failed to send SMS.'
            ]
        ]
    ],
    'stripe'    => [
        'charge'    => [
            'fail'  => 'Stripe Charge Failed.'
        ]
    ]
];
