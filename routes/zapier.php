<?php
Route::group(['middleware' => ['zapier']], function () {
    Route::get('/me', 'UserController@getUserInfo');
    Route::group(['prefix' => 'property'], function () {
        Route::post('/create', 'ZapierController@createLead')->middleware('user.check.addon');
        Route::get('/statusChanged', 'ZapierController@statusChanged');
        Route::get('/newDealAdded', 'ZapierController@newDealAdded');
        Route::get('/smsCampaignFinished', 'ZapierController@smsCampaignFinished');
        Route::get('/mailCampaignFinished', 'ZapierController@mailCampaignFinished');
    });
    Route::post('/subscribe', 'ZapierController@subscribe');
    Route::delete('/unsubscribe', 'ZapierController@unsubscribe');
});
