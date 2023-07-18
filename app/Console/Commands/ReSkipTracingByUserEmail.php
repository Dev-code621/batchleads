<?php

namespace App\Console\Commands;

use App\Models\Team;
use App\Models\TeamUser;
use App\Services\PropertyService;
use App\Services\SkipTracingService;
use App\Services\UserService;
use Illuminate\Console\Command;

class ReSkipTracingByUserEmail extends Command
{
    protected $skipTracingService;
    protected $userService;
    protected $propertyService;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'skiptracing:reset {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'ReSkipTracing By User Email';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        SkipTracingService $skipTracingService,
        UserService $userService,
        PropertyService $propertyService
    )
    {
        parent::__construct();

        $this->skipTracingService = $skipTracingService;
        $this->userService = $userService;
        $this->propertyService = $propertyService;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $email = $this->argument('email');
        echo 'Email = ' . $email . PHP_EOL;
        $user = $this->userService->findUser(
            array(
                'email' => $email
            )
        );
        $userId = $user['id'];
        $teamId = $this->getTeamId($user);
        echo 'User Id = ' . $userId . PHP_EOL;
        echo 'Team Id = ' . $teamId . PHP_EOL;

        $properties = $this->propertyService->findWhere(
            array(
                'user_id'   => $userId,
                'team_id'   => $teamId
            )
        );

        $propertiesToSkipTrace = [];
        foreach ($properties as $property) {
            if ($property['skip_tracing_date']) {
                $propertiesToSkipTrace []= $property;
            }
        }

        $result = $this->skipTracingService->skipTracing($propertiesToSkipTrace, $teamId, $userId);
        print_r($result);
    }

    protected function getTeamId($user)
    {
        $userId = $user['id'];
        $userRole = $user['role'];

        $teamId = 0;

        if ($userRole === config('services.user_role.owner')) {
            $team = Team::where('owner_user_id', $userId)->first();
            if ($team) {
                $teamId = $team->id;
            }
        } else {
            $teamUser = TeamUser::where('user_id', $userId)->first();
            if ($teamUser) {
                $teamId = $teamUser->team_id;
            }
        }

        return $teamId;
    }
}
