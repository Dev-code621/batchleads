<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\CreditTransactionType;

/**
 * Class CreditTransactionTypeRepository
 *
 * @package App\Http\Repositories
 */
class CreditTransactionTypeRepository extends BaseRepository
{
    /**
     * CreditTransactionTypeRepository constructor.
     *
     * @param CreditTransactionType $model
     */
    public function __construct(CreditTransactionType $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return CreditTransactionType|null
     */
    public function create(array $data): ?CreditTransactionType
    {
        $package = $this->model->newInstance();
        $package->name = $data['name'] ?? null;
        $package->transaction_type = $data['transaction_type'] ?? null;
        $package->credit_amount = $data['credit_amount'] ?? null;

        return $package->save() ? $package : null;
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

        $data = DB::table('credit_transaction_types');

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
