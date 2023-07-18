<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\CreditTransaction;

/**
 * Class CreditTransactionRepository
 *
 * @package App\Http\Repositories
 */
class CreditTransactionRepository extends BaseRepository
{
    /**
     * CreditTransactionRepository constructor.
     *
     * @param CreditTransaction $model
     */
    public function __construct(CreditTransaction $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return CreditTransaction|null
     */
    public function create(array $data): ?CreditTransaction
    {
        $history = $this->model->newInstance();
        $history->credit_transaction_type = $data['credit_transaction_type'] ?? null;
        $history->credit_amount = $data['credit_amount'] ?? null;
        $history->reference_id = $data['reference_id'] ?? null;
        $history->credit_ballance_after_transaction = $data['credit_ballance_after_transaction'] ?? null;
        $history->other = $data['other'] ?? null;
        $history->user_id = $data['user_id'] ?? null;
        $history->reference_user_id = $data['reference_user_id'] ?? null;

        return $history->save() ? $history : null;
    }

    /**
     * @param array $params
     *
     * @return array
     */
    public function search(array $params)
    {
        $orderBy = $params['orderBy'] ?? 'created_at';
        $order = $params['order'] ?? 'desc';
        $perPage = $params['per_page'] ?? 10;
        $page = $params['page'] ?? null;
        $search = $params['search'] ?? null;
        $userId = $params['userId'] ?? null;

        $data = $this->model;
        if ($userId) {
            $data = $data->where('user_id', $userId);
        }
        if ($search) {
            $data = $data->whereRaw('lower(credit_transaction_type) like (?)', '%' . strtolower($search) . '%');
        }

        $total = $data->count();
        $data = $data->orderBy($orderBy, $order)
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        $result = array(
            'total'          => $total,
            'page'           => $page,
            'count_per_page' => $perPage,
            'count'          => $data->count(),
            'data'           => $data,
        );

        return $result;
    }
}
