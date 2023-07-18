<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerifySignUp extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $token;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($name, $token)
    {
        $this->name = $name;
        $this->token = $token;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $address = config('mail.from.address');
        $subject = 'Verify BatchDriven Signup!';
        $name = config('mail.from.name');

        return $this->view('emails.verifysignup')
            ->from($address, $name)
            // ->cc($address, $name)
            // ->bcc($address, $name)
            ->replyTo($address, $name)
            ->subject($subject)
            ->with([
                'name' => $this->name,
                'token' => $this->token
            ]);
    }
}
