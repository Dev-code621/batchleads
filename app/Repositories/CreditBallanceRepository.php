<?php
namespace App\Repositories;

use App\Models\CreditBallance;

/**
 * Class CreditBallanceRepository
 *
 * @package App\Http\Repositories
 */
class CreditBallanceRepository extends BaseRepository
{
    /**
     * CreditBallanceRepository constructor.
     *
     * @param CreditBallance $model
     */
    public function __construct(CreditBallance $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return CreditBallance|null
     */
    public function create(array $data): ?CreditBallance
    {
        $ballance = $this->model->newInstance();
        $ballance->user_id = $data['user_id'] ?? null;
        $ballance->ballance = $data['ballance'] ?? null;

        return $ballance->save() ? $ballance : null;
    }

    public function getBallanceByUserId($userId)
    {
        return $this->findBy('user_id', $userId);
    }

    public function increaseBallance($userId, $amount)
    {
        $ballances = $this->findBy('user_id', $userId);

        if (count($ballances) > 0) {
            $ballance = $ballances[0]->ballance + $amount;
            return $this->update($ballances[0]->id, array('ballance' => $ballance));
        } else {
            $data = $this->create(
                array(
                    'user_id'   => $userId,
                    'ballance'  => $amount
                )
            );
            return $data;
        }
    }

    public function decreaseBallance($userId, $amount)
    {
        $ballances = $this->findBy('user_id', $userId);

        if (count($ballances) > 0) {
            $ballance = $ballances[0]->ballance - $amount;
            return $this->update($ballances[0]->id, array('ballance' => $ballance));
        }
        return null;
    }

    public function checkBallance($userId, $amount)
    {
        $ballances = $this->findBy('user_id', $userId);

        if (count($ballances) > 0) {
            $ballance = $ballances[0]->ballance;

            if ($ballance >= $amount) {
                return true;
            }
            return false;
        }
        return false;
    }
}
