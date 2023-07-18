<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => ['api']], function () {
    Route::post(
        '/stripe/webhook',
        'StripeWebhookController@handleWebhook'
    );
    Route::post(
        '/callforwarding/forwarding/{userId}',
        'CallForwardingController@forwarding'
    );
    Route::group(['prefix' => 'users'], function () {
        Route::post('/register', 'Auth\RegisterController@register')->middleware('user.signup');
        Route::post('/login', 'Auth\LoginController@login');
        Route::get('/refresh', 'Auth\LoginController@refresh');
        Route::get('/logout', 'Auth\LoginController@logout');
        Route::post('/validate-register', 'Auth\LoginController@validateRegister');
        Route::post('/forgotPassword', 'UserController@forgotPassword');
        Route::post('/changePassword', 'UserController@changePassword');
        Route::get('/verify', 'UserController@verify');
        Route::get('/verify/resend', 'UserController@resendVerification');
    });
    Route::group(['prefix' => 'mail/campaign'], function () {
        Route::post('/deliveryStatusUpdate', 'MailCampaignController@deliveryStatusUpdate');
    });
    Route::group(['prefix' => 'stripe'], function () {
        Route::get('/subscribe/getPlans', 'SubscribeController@getPlans');
        Route::get('/addons', 'AddOnController@getAddOns');
    });
    Route::group(['prefix' => 'twilio'], function () {
        Route::post('/receive', 'TwilioController@receive');
    });
});

Route::group(['middleware' => ['auth:api', 'credit.balance', 'property.history']], function () {
    Route::group(['prefix' => 'users'], function () {
        Route::post('/update', 'UserController@updateUserInfo');
        Route::get('/getUserInfo', 'UserController@getUserInfo');
        Route::get('/registerOneSignal', 'UserController@registerOneSignalUserId');
        Route::get('/ping', 'UserPingController@getUserPing');
        Route::post('/ping', 'UserPingController@create');
        Route::put('/ping', 'UserPingController@updateUserPing');
        Route::post('/addon', 'AddOnController@subscribeAddOn')->middleware('auth.role');
        Route::delete('/addon', 'AddOnController@cancelAddOn')->middleware('auth.role');
        Route::group(['prefix' => 'notification'], function () {
            Route::put('/update', 'UserNotificationSettingController@updateSetting');
            Route::get('/', 'UserNotificationSettingController@index');
        });
        Route::group(['prefix' => 'callforwarding'], function () {
            Route::post('/', 'CallForwardingController@create');
        });
        Route::post('/autoRechargeSetting', 'AutoRechargeSettingController@updateSetting')->middleware('auth.role');
        Route::post('/pause', 'UserController@pauseUser')->middleware('auth.role');
        Route::post('/cancel', 'UserController@cancelUser')->middleware('auth.role');
    });
    Route::group(['prefix' => 'folder', 'middleware' => ['auth.role', 'user.subscription.status']], function () {
        Route::post('/create', 'FolderController@create');
        Route::get('/read/{id}', 'FolderController@read');
        Route::put('/update/{id}', 'FolderController@update');
        Route::delete('/delete/{id}', 'FolderController@delete');
        Route::get('/{page}', 'FolderController@index');
        Route::get('/', 'FolderController@index');
    });
    Route::group(['prefix' => 'state', 'middleware' => ['user.subscription.status']], function () {
        Route::post('/create', 'StateController@create');
        Route::get('/read/{id}', 'StateController@read');
        Route::put('/update/{id}', 'StateController@update');
        Route::delete('/delete/{id}', 'StateController@deleteState');
        Route::get('/{page}', 'StateController@index');
        Route::get('/', 'StateController@index');
    });

    Route::group(['prefix' => 'tag', 'middleware' => ['user.subscription.status']], function () {
        Route::post('/create', 'TagController@create');
        Route::get('/read/{id}', 'TagController@read');
        Route::post('/update/{id}', 'TagController@update');
        Route::delete('/delete/{id}', 'TagController@delete');
        Route::get('/{page}', 'TagController@index');
        Route::get('/', 'TagController@index');
    });

    Route::group(['prefix' => 'property', 'middleware' => ['user.subscription.status']], function () {
        Route::post('/export', 'DataManagerController@export');
        Route::get('/download', 'DataManagerController@download');
        Route::post('/import', 'DataManagerController@import');
        Route::post('/upload', 'DataManagerController@uploadCsv');
        Route::group(['prefix' => 'history'], function () {
            Route::post('/create', 'PropertyHistoryController@create');
            Route::get('/{page}', 'PropertyHistoryController@list');
            Route::get('/', 'PropertyHistoryController@list');
        });
        Route::group(['prefix' => 'tag'], function () {
            Route::post('/create', 'PropertyTagController@create');
            Route::get('/read/{id}', 'PropertyTagController@read');
            Route::delete('/delete/{id}', 'PropertyTagController@delete');
            Route::get('/{page}', 'PropertyTagController@index');
            Route::get('/', 'PropertyTagController@index');
        });
        Route::post('/create', 'PropertyController@create')->middleware('user.check.addon', 'zapier.trigger');
        Route::post('/bulkAdd', 'PropertyController@propertyBulkAdd')->middleware('user.check.addon');
        Route::post('/searchAdd', 'PropertyController@propertySearchAdd');
        Route::get('/stopAllCampaigns', 'PropertyController@stopAllCampaigns');
        Route::get('/read/{id}', 'PropertyController@read')->middleware('user.check.addon');
        Route::post('/update/{id}', 'PropertyController@update')->middleware('zapier.trigger');
        Route::delete('/delete/{id}', 'PropertyController@delete');
        Route::delete('/delete', 'PropertyController@deleteList');
        Route::get('/search', 'PropertyController@propertySearchByAddress')->middleware('user.check.addon');
        Route::post('/propertySearchByCounty', 'PropertyController@propertySearchByCounty')->middleware('user.check.addon');
        Route::post('/propertySearchByCounty/{page}', 'PropertyController@propertySearchByCounty')->middleware('user.check.addon');
        Route::post('/propertySearchByCounty/{page}/{pageSize}', 'PropertyController@propertySearchByCounty')->middleware('user.check.addon');
        Route::post('/propertySearchByZipCode', 'PropertyController@propertySearchByZipCode')->middleware('user.check.addon');
        Route::post('/propertySearchByZipCode/{page}', 'PropertyController@propertySearchByZipCode')->middleware('user.check.addon');
        Route::post('/propertySearchByZipCode/{page}/{pageSize}', 'PropertyController@propertySearchByZipCode')->middleware('user.check.addon');
        Route::get('/PropertySearchByZipCodeRequest', 'PropertyController@propertySearchByZipCode')->middleware('user.check.addon');
        Route::get('/PropertySearchByZipCodeRequest/{page}', 'PropertyController@propertySearchByZipCode')->middleware('user.check.addon');
        Route::get('/PropertySearchByZipCodeRequest/{page}/{pageSize}', 'PropertyController@propertySearchByZipCode')->middleware('user.check.addon');
        Route::post('/searchByRegion', 'PropertyController@propertySearchByRegion')->middleware('user.check.addon');
        Route::post('/searchByRegion/{page}', 'PropertyController@propertySearchByRegion')->middleware('user.check.addon');
        Route::post('/searchByRegion/{page}/{pageSize}', 'PropertyController@propertySearchByRegion')->middleware('user.check.addon');
        Route::post('/searchByDistance_', 'PropertyController@propertySearchByDistance')->middleware('user.check.addon');
        Route::post('/searchByLatLng', 'PropertyController@propertySearchByLatLng')->middleware('user.check.addon');
        Route::post('/searchByDistance', 'PropertyController@propertySearchByLatLng')->middleware('user.check.addon'); // for mobile - need to update
        Route::post('/bulkStatusUpdate', 'PropertyController@bulkStatusUpdate')->middleware('zapier.trigger');
        Route::post('/bulkFolderUpdate', 'PropertyController@bulkFolderUpdate');
        Route::get('/{page}', 'PropertyController@list')->middleware('user.check.addon');
        Route::get('/', 'PropertyController@list')->middleware('user.check.addon');
        Route::post('/filterByRegion/{page}', 'PropertyController@filterByRegion')->middleware('user.check.addon');
        Route::post('/filterByRegion', 'PropertyController@filterByRegion')->middleware('user.check.addon');
        Route::post('/getNotSkipTracedCount', 'PropertyController@getNotSkipTracedCount');
        Route::post('/{page}', 'PropertyController@listForPropertyStatus')->middleware('user.check.addon');
        Route::post('/', 'PropertyController@listForPropertyStatus')->middleware('user.check.addon');
        Route::group(['prefix' => 'phone'], function () {
            Route::get('/getPropertiesByPhoneNumber', 'PropertyPhoneController@getPropertiesByPhoneNumber');
            Route::get('/getSmsMastersByPropertyId', 'PropertyPhoneController@getSmsMastersByPropertyId');
            Route::post('/create', 'PropertyPhoneController@create');
            Route::put('/update/{id}', 'PropertyPhoneController@update');
            Route::delete('/delete/{id}', 'PropertyPhoneController@delete');
        });
        Route::group(['prefix' => 'email'], function () {
            Route::post('/create', 'PropertyEmailController@create');
            Route::put('/update/{id}', 'PropertyEmailController@update');
            Route::delete('/delete/{id}', 'PropertyEmailController@delete');
        });
    });

    Route::group(['prefix' => 'stripe'], function () {
        Route::get('/getUpcomingInvoice', 'CreditController@getUpcomingInvoice');
        Route::post('/subscribe', 'SubscribeController@subscribe')->middleware('user.subscribe');
        Route::post('/subscribe/change', 'SubscribeController@subscribeChange')->middleware('user.subscribe');
        Route::get('/subscribe/endTrial', 'SubscribeController@endTrial');
        Route::get('/getPymentMethod', 'SubscribeController@getPaymentMethod');
        Route::post('/addCard', 'SubscribeController@addCard');
        Route::get('/removeCard', 'SubscribeController@removeCard');
        Route::get('/setDefaultCard', 'SubscribeController@setDefaultCard');
        Route::get('/getSubscriptions', 'SubscribeController@getSubscriptions');
    });

    Route::group(['prefix' => 'drivingRoute', 'middleware' => ['user.subscription.status']], function () {
        Route::post('/create', 'DrivingRouteController@create');
        Route::get('/read/{id}', 'DrivingRouteController@read');
        Route::put('/update/{id}', 'DrivingRouteController@update');
        Route::delete('/delete/{id}', 'DrivingRouteController@delete');
        Route::get('/search', 'DrivingRouteController@search');
        Route::get('/{page}', 'DrivingRouteController@list');
        Route::get('/', 'DrivingRouteController@list');
    });

    Route::group(['prefix' => 'skipTracing', 'middleware' => ['user.subscription.status']], function () {
        Route::get('/fetch/all', 'SkipTracingController@allSkipTracing');
        Route::post('/fetch/bulk', 'SkipTracingController@bulkSkipTracing');
        Route::get('/fetch/{propertyId}', 'SkipTracingController@fetchSkipTracing');
    });

    Route::group(['prefix' => 'sms/campaign', 'middleware' => ['user.subscription.status']], function () {
        Route::get('/read/{id}', 'SmsCampaignController@read');
        Route::post('/start', 'SmsCampaignController@start');
        Route::post('/bulkStart', 'SmsCampaignController@bulkStart');
        Route::post('/sendSms', 'SmsCampaignController@sendSms');
        Route::get('/getMessageBox/{page}', 'SmsCampaignController@getMessageBox');
        Route::get('/getMessageBox', 'SmsCampaignController@getMessageBox');
        Route::get('/getMessages/{masterId}/{page}', 'SmsCampaignController@getMessagesByMasterId');
        Route::get('/getMessages/{masterId}', 'SmsCampaignController@getMessagesByMasterId');
        Route::get('/setMessagesRead/{masterId}', 'SmsCampaignController@setMessagesRead');
        Route::get('/cancel/{campaignId}', 'SmsCampaignController@cancelCampaign')->middleware('zapier.trigger');
        Route::get('/getTotalBadge', 'SmsCampaignController@getTotalBadge');
        Route::get('/getSmsMaster/{id}', 'SmsCampaignController@getSmsMaster');
        Route::delete('/deleteSmsMaster/{id}', 'SmsCampaignController@deleteSmsMaster');

        Route::group(['prefix' => 'template'], function () {
            Route::post('/create', 'SmsCampaignTemplateController@create');
            Route::put('/update/{id}', 'SmsCampaignTemplateController@update');
            Route::get('/read/{id}', 'SmsCampaignTemplateMasterController@read');
            Route::delete('/delete/{id}', 'SmsCampaignTemplateMasterController@delete');
            Route::get('/', 'SmsCampaignTemplateMasterController@list');
            Route::get('/{page}', 'SmsCampaignTemplateMasterController@list');
        });

        Route::group(['prefix' => 'master'], function () {
            Route::post('/create', 'SmsCampaignTemplateMasterController@create');
            Route::get('/read/{id}', 'SmsCampaignTemplateMasterController@read');
            Route::put('/update/{id}', 'SmsCampaignTemplateMasterController@update');
            Route::delete('/delete/{id}', 'SmsCampaignTemplateMasterController@delete');
            Route::get('/', 'SmsCampaignTemplateMasterController@list');
            Route::get('/{page}', 'SmsCampaignTemplateMasterController@list');
        });

        Route::group(['prefix' => 'detail'], function () {
            Route::post('/create', 'SmsCampaignTemplateDetailController@create');
            Route::get('/read/{id}', 'SmsCampaignTemplateDetailController@read');
            Route::put('/update/{id}', 'SmsCampaignTemplateDetailController@update');
            Route::delete('/delete/{id}', 'SmsCampaignTemplateDetailController@delete');
            Route::get('/{page}', 'SmsCampaignTemplateDetailController@index');
            Route::get('/', 'SmsCampaignTemplateDetailController@index');
        });

        Route::get('/', 'SmsCampaignController@index');
        Route::get('/{page}', 'SmsCampaignController@index');
    });

    Route::group(['prefix' => 'mail/campaign', 'middleware' => ['user.subscription.status']], function () {
        Route::get('/read/{id}', 'MailCampaignController@read');
        Route::get('/templates', 'MailCampaignController@getTemplates');
        Route::post('/start', 'MailCampaignController@start');
        Route::post('/bulkStart', 'MailCampaignController@bulkStart');
        Route::get('/cancel/{campaignId}', 'MailCampaignController@cancelCampaign')->middleware('zapier.trigger');

        Route::group(['prefix' => 'signature'], function () {
            Route::post('/create', 'MailSignatureController@create');
            Route::get('/read/{id}', 'MailSignatureController@read');
            Route::put('/update/{id}', 'MailSignatureController@update');
            Route::delete('/delete/{id}', 'MailSignatureController@delete');
            Route::get('/', 'MailSignatureController@index');
            Route::get('/{page}', 'MailSignatureController@index');
        });

        Route::group(['prefix' => 'template'], function () {
            Route::post('/create', 'MailTemplateController@create');
            Route::get('/read/{id}', 'MailTemplateController@read');
            Route::put('/update/{id}', 'MailTemplateController@update');
            Route::delete('/delete/{id}', 'MailTemplateController@delete');

            Route::group(['prefix' => 'style'], function () {
                Route::post('/create', 'MailTemplateStyleController@create');
                Route::get('/read/{id}', 'MailTemplateStyleController@read');
                Route::post('/update/{id}', 'MailTemplateStyleController@update');
                Route::delete('/delete/{id}', 'MailTemplateStyleController@delete');
                Route::get('/', 'MailTemplateStyleController@index');
                Route::get('/{page}', 'MailTemplateStyleController@index');
            });

            Route::get('/', 'MailTemplateController@index');
            Route::get('/{page}', 'MailTemplateController@index');
        });

        Route::get('/', 'MailCampaignController@list');
        Route::get('/{page}', 'MailCampaignController@list');
    });

    Route::group(['prefix' => 'credit', 'middleware' => ['user.subscription.status']], function () {
        Route::post('/charge', 'CreditController@chargeCredit')->middleware('auth.role');
        Route::group(['prefix' => 'package'], function () {
            Route::get('/read/{id}', 'CreditPackageController@read');
            Route::get('/{page}', 'CreditPackageController@index');
            Route::get('/', 'CreditPackageController@index');
        });

        Route::group(['prefix' => 'transaction'], function () {
            Route::get('/history/{page}', 'CreditController@getTransactionHistory');
            Route::get('/history', 'CreditController@getTransactionHistory');
            Route::group(['prefix' => 'type'], function () {
                Route::get('/read/{id}', 'CreditTransactionTypeController@read');
                Route::get('/{page}', 'CreditTransactionTypeController@index');
                Route::get('/', 'CreditTransactionTypeController@index');
            });
            Route::post('/checkBalance', 'CreditController@checkBalance');
        });
    });

    Route::group(['prefix' => 'team', 'middleware' => ['auth.role', 'user.invitation', 'user.subscription.status']], function () {
        Route::get('/getTeamMembers', 'TeamController@getTeamMembers');
        Route::group(['prefix' => 'user'], function () {
            Route::post('/invite', 'TeamUserController@inviteUser');
            Route::get('/invite/cancel/{invitationId}', 'TeamUserController@cancelInvitation');
            Route::get('/remove/{userId}', 'TeamUserController@removeUser');
        });
    });

    Route::group(['prefix' => 'users', 'middleware' => ['auth.role', 'user.subscription.status']], function () {
        Route::post('/updateUserRole', 'UserController@updateUserRole');
    });

    Route::group(['prefix' => 'twilio', 'middleware' => ['user.subscription.status']], function () {
        Route::get('/purchasePhoneNumber', 'TwilioController@purchasePhoneNumber');
        Route::get('/searchAvailablePhoneNumbers', 'TwilioController@searchAvailablePhoneNumbers');
        Route::get('/getPurchasedPhoneNumbers', 'TwilioController@getPurchasedPhoneNumbers');
        Route::get('/releasePhoneNumber', 'TwilioController@releasePhoneNumber');
    });

    Route::group(['prefix' => 'kpi', 'middleware' => ['user.subscription.status']], function () {
        Route::post('/get', 'KpiController@getKpis');
    });
    Route::group(['prefix' => 'zillow'], function () {
        Route::post('/getLink', 'ZillowController@getSearchResult');
    });
});
