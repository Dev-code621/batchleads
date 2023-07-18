<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

// Route::get('/subscribe', function () {
//   return view('subscribe');
// });
// Route::get('/home', 'HomeController@index')->name('home');
// Route::get('/verify/{token}', 'UserController@index')->name('verify');
// Route::get('/verify/resend/{email}', 'UserController@resendVerification')->name('verify');
Route::view('/{path?}', 'app');
Route::view('/{path?}/{param?}', 'app');
Route::view('/{path?}/{param?}/{param1?}', 'app');
Route::view('/{path?}/{param?}/{param1?}/{param2?}', 'app');
Route::view('/{path?}/{param?}/{param1?}/{param2?}/{param3?}', 'app');

Auth::routes();

// Route::post('/get_stripe_token', 'SubscribeController@getStripeToken');
