<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\CreditPackage;

/**
 * Class CreditPackageRepository
 *
 * @package App\Http\Repositories
 */
class CreditPackageRepository extends BaseRepository
{
    /**
     * CreditPackageRepository constructor.
     *
     * @param CreditPackage $model
     */
    public function __construct(CreditPackage $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return CreditPackage|null
     */
    public function create(array $data): ?CreditPackage
    {
        $package = $this->model->newInstance();
        $package->price = $data['price'] ?? null;
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

        $data = DB::table('credit_packages');

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
