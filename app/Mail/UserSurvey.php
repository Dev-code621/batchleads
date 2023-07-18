<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class UserSurvey extends Mailable
{
    use Queueable, SerializesModels;

    public $text;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($text)
    {
        $this->text = $text;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $address = config('mail.from.address');
        $subject = 'User Survey!';
        $name = config('mail.from.name');

        return $this->view('emails.survey')
            ->from($address, $name)
            // ->cc($address, $name)
            // ->bcc($address, $name)
            ->replyTo($address, $name)
            ->subject($subject)
            ->with([ 'text' => $this->text ]);
    }
}
