<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\UserService;
use App\Services\UserFpService;

class CreatePromoters extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:createpromoters';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create FirstPromoters';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(UserService $userService, UserFpService $userFpService)
    {
        parent::__construct();
        $this->userService = $userService;
        $this->userFpService = $userFpService;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        echo "Creating User Promoters......\r\n";
        $users = $this->userService->getAllUsers();
        foreach ($users as $user) {
            $promoter = $this->userFpService->getUserPromoterByUserId($user['id']);
            if (!$promoter) {
                $result = $this->userFpService->createPromoter($user['email']);
                if ($result) {
                    $authToken = $result['auth_token'];
                    $refId = null;
                    $promotions = $result['promotions'];
                    if (count($promotions)) {
                        $refId = $promotions[0]['ref_id'];
                    }
                    $this->userFpService->create(
                        array(
                            'user_id'       => $user['id'],
                            'ref_id'        => $refId,
                            'auth_token'    => $authToken
                        )
                    );
                }
            }
        }
        echo "Finished!\r\n";
    }
}
