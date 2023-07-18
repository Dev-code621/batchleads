<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Carbon\Carbon;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Auth\MustVerifyEmail;
use Laravel\Passport\HasApiTokens;
use Laravel\Cashier\Billable;

/**
 * @property int            $id
 * @property string         $name
 * @property string         $email
 * @property string         $phone
 * @property string         $company
 * @property string         $password
 * @property string         $token
 * @property Carbon         $email_verified_at
 * @property Carbon         $created_at
 * @property Carbon         $updated_at
 */
class User extends Authenticatable implements JWTSubject
{
    use Notifiable, MustVerifyEmail, HasApiTokens, Billable;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'company',
        'token',
        'email_verified_at',
        'latitude',
        'longitude',
        'photo_url',
        'twilio_messaging_service_id',
    ];

    protected $appends = ['user_notification_settings', 'first_promoter', 'call_forwarding'];

    // public function getCreditAttribute() {
    //     return $this->credit()->first();
    // }

    public function getUserNotificationSettingsAttribute() {
        return $this->userNotificationSettings()->get();
    }

    public function getFirstPromoterAttribute() {
        return $this->userFp()->first();
    }

    public function getCallForwardingAttribute() {
        return $this->callForwarding()->first();
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * @return null|string
     */
    public function routeNotificationForOneSignal(): ?string
    {
        return $this->onesignal_id;
    }

    public function password(): string {
        return $this->password;
    }

    public function folders() {
        return $this->hasMany('App\Models\Folder');
    }

    public function drivingRoutes() {
        return $this->hasMany('App\Models\DrivingRoute');
    }

    public function properties() {
        return $this->hasMany('App\Models\Property');
    }

    public function team() {
        return $this->belongsTo('App\Models\Team');
    }

    public function credit() {
        return $this->hasOne('App\Models\CreditBallance');
    }

    public function userNotificationSettings() {
        return $this->hasMany('App\Models\UserNotificationSetting');
    }

    public function userFp() {
        return $this->hasOne('App\Models\UserFp');
    }

    public function callForwarding() {
        return $this->hasOne('App\Models\CallForwarding');
    }

    public function zapierSubscribes() {
        return $this->hasMany('App\Models\ZapierSubscribe');
    }
}
