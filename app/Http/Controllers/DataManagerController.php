<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataExportRequest;
use App\Http\Requests\DataImportRequest;
use App\Http\Requests\DataUploadRequest;
use App\Jobs\DataImportJob;
use App\Jobs\DataExportJob;
use App\Services\PropertyService;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use ArrayHelpers\Arr;

/**
 * Class DataManagerController
 *
 * @package App\Http\Controllers
 */
class DataManagerController extends Controller
{
    /**
     * constructor.
     *
     * @param PropertyService $service
     */
    public function __construct(PropertyService $service, StripeService $stripeService)
    {
        $this->baseService = $service;
        $this->stripeService = $stripeService;
    }

    public function export(DataExportRequest $request)
    {
        $data = $request->validated();
        $type = $data['type'];
        $filter = Arr::get($data, 'filter', null);
        $user = $request->user();
        $userId = $user['id'];
        $teamId = $this->getTeamId($user);

        DataExportJob::dispatch($type, $userId, $teamId, $filter, $this->stripeService);
        return $this->responseWithSuccess('Success');
    }

    public function download(Request $request)
    {
        $user = $request->user();
        $fileName = 'property_export_' . $user['id'] . '.csv';

        return Storage::download($fileName);
    }

    public function uploadCsv(DataUploadRequest $request)
    {
        $milliseconds = round(microtime(true) * 1000);
        $fileName = $milliseconds . '.csv';
        $request->file('import_file')->storeAs('public', $fileName);
        $path = Storage::disk('public')->path($fileName);
        $csv = new \ParseCsv\Csv($path);
        $count = count($csv->data);

        $keys = [];
        $properties = $csv->data;
        if ($count > 0) {
            $keys = array_keys($properties[0]);
        }

        return $this->responseWithSuccess(
            array(
                'keys'       => $keys,
                'file_name'  => $fileName,
                'count'      => $count
            )
        );
    }

    public function import(DataImportRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();
        $teamId = $this->getTeamId($user);
        $userId = $user['id'];
        $folderId = $data['folder_id'];
        $fileName = $data['file_name'];
        $path = Storage::disk('public')->path($fileName);
        if (file_exists($path)) {
            DataImportJob::dispatch($userId, $teamId, $path, $folderId, $this->baseService, $data);
            return $this->responseWithSuccess('Success');
        } else {
            return $this->responseWithError('No Existing File!');
        }
    }
}
