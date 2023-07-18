<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class InsufficientCredits extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $type;
    public $creditCount;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user, $type, $creditCount)
    {
        $this->user = $user;
        $this->type = $type;
        $this->creditCount = $creditCount;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $address = config('mail.from.address');
        $subject = 'You have insufficient funds!';
        $name = config('mail.from.name');

        return $this->view('emails.insufficientcredits')
            ->from($address, $name)
            // ->cc($address, $name)
            // ->bcc($address, $name)
            ->replyTo($address, $name)
            ->subject($subject)
            ->with([
                'user'          => $this->user,
                'type'          => $this->type,
                'creditCount'   => $this->creditCount,
                'app_url'       => config('app.url')
            ]);
    }
}
