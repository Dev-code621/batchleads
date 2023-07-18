<?php

namespace App\Services;

use App\Repositories\BaseRepository;

/**
 * Class BaseService
 *
 * @package App\Http\Services
 */
class BaseService
{
    protected $repository;

    /**
     * BaseService constructor.
     *
     * @param repository $repository
     */
    public function __construct(BaseRepository $baseRepository)
    {
        $this->repository = $baseRepository;
    }

    /**
     * @param array $data
     *
     * @return Object|null
     */
    public function create(array $data)
    {
        return $this->repository->create($data);
    }

    /**
     * @param $id
     *
     * @return Object|null
     */
    public function read($id, array $relationships = [])
    {
        return $this->repository->find($id, $relationships);
    }

    /**
     * @param $id
     * @param array $data
     *
     * @return Object|null
     */
    public function update($id, $data)
    {
        return $this->repository->update($id, $data);
    }

    /**
     * @param $id
     *
     * @return Object|null
     */
    public function delete($id)
    {
        return $this->repository->delete($id);
    }

    public function deleteAll(array $where = [])
    {
        return $this->repository->deleteAll($where);
    }

    /**
     * @param array $ids
     *
     * @return Object|null
     */
    public function batchDelete($ids)
    {
        return $this->repository->batchDelete($ids);
    }

    /**
     * @param $pageSize
     *
     * @return Object|null
     */
    public function list($params)
    {
        return $this->repository->list($params);
    }

    /**
     * @param array $params
     *
     * @return Object|null
     */
    public function search(array $params)
    {
        return $this->repository->search($params);
    }

    public function findWhere(array $where, array $relationships = [])
    {
        return $this->repository->findWhere($where, $relationships);
    }

    public function findWhereCount(array $where)
    {
        return $this->repository->findWhereCount($where);
    }

    public function findAndDelete(array $where)
    {
        return $this->repository->findAndDelete($where);
    }
}
