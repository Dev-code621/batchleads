<?php
namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateFolderRequest;
use App\Http\Requests\UpdateFolderRequest;
use App\Http\Requests\DefaultDeleteRequest;
use App\Services\FolderService;
use App\Services\PropertyService;

/**
 * Class FolderController
 *
 * @package App\Http\Controllers
 */
class FolderController extends Controller
{
    /**
     * constructor.
     *
     * @param FolderService $folderService
     */
    public function __construct(FolderService $folderService, PropertyService $propertyService)
    {
        $this->baseService = $folderService;
        $this->propertyService = $propertyService;
    }

    public function create(CreateFolderRequest $request)
    {
        $user = $request->user();
        $teamId = $this->getTeamId($user);
        $name = $request->get('name');
        $request->validate([
            'name' => [
                'required',
                 Rule::unique('folders')->where(function ($query) use($name, $teamId) {
                   return $query->where('name', $name)->where('team_id', $teamId);
                 })
            ]
        ]);
        return $this->add($request);
    }

    public function update(UpdateFolderRequest $request, $folderId)
    {
        $user = $request->user();
        $teamId = $this->getTeamId($user);
        $name = $request->get('name');

        $request->validate([
            'name' => [
                'required',
                 Rule::unique('folders')->where(function ($query) use($name, $teamId) {
                   return $query->where('name', $name)->where('team_id', $teamId);
                 })
            ]
        ]);
        return $this->updateData($request, $folderId);
    }

    public function delete(DefaultDeleteRequest $request, $id)
    {
        $count = $this->propertyService->getSearchCount(
            array(
                'folder_id' => $id
            )
        );
        if ($count > 0) {
            return $this->responseWithError('Folder is in use');
        }

        $data = $this->baseService->delete($id);
        return $data
            ? $this->responseWithSuccess($data, 'delete.success')
            : $this->responseWithError(__('error.delete.fail'));
    }
}
