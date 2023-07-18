<?php
namespace App\Http\Controllers;

use Intervention\Image\ImageManagerStatic as Image;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateMailTemplateStyleRequest;
use App\Http\Requests\UpdateMailTemplateStyleRequest;
use App\Services\MailTemplateStyleService;

/**
 * Class MailTemplateStyleController
 *
 * @package App\Http\Controllers
 */
class MailTemplateStyleController extends Controller
{
    /**
     * constructor.
     *
     * @param MailTemplateStyleService $service
     */
    public function __construct(MailTemplateStyleService $service)
    {
        $this->baseService = $service;
    }

    public function create(CreateMailTemplateStyleRequest $request)
    {
        $data = $request->validated();

        $baseUrl = url('/') . '/style_images';

        $image = request()->front_preview_image;
        $imageName = time() . '_front.' . $image->getClientOriginalExtension();
        $image_resize = Image::make($image->getRealPath());
        $image_resize->resize(300, 300 / 1.5);
        $image_resize->save(public_path('style_images/' . $imageName));

        $data['front_preview_image_url'] = $baseUrl . '/' . $imageName;

        $image = request()->back_preview_image;
        $imageName = time() . '_back.' . $image->getClientOriginalExtension();
        $image_resize = Image::make($image->getRealPath());
        $image_resize->resize(300, 300 / 1.5);
        $image_resize->save(public_path('style_images/' . $imageName));

        $data['back_preview_image_url'] = $baseUrl . '/' . $imageName;

        $result = $this->baseService->create($data);

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.create.fail'));
    }

    public function update(UpdateMailTemplateStyleRequest $request, $id)
    {
        $data = $request->validated();

        $baseUrl = url('/') . '/style_images';

        if (request()->front_preview_image) {
            $image = request()->front_preview_image;
            $imageName = time() . '_front.' . $image->getClientOriginalExtension();
            $image_resize = Image::make($image->getRealPath());
            $image_resize->resize(300, 300 / 1.5);
            $image_resize->save(public_path('style_images/' . $imageName));

            $data['front_preview_image_url'] = $baseUrl . '/' . $imageName;
        }

        if (request()->back_preview_image) {
            $image = request()->back_preview_image;
            $imageName = time() . '_back.' . $image->getClientOriginalExtension();
            $image_resize = Image::make($image->getRealPath());
            $image_resize->resize(300, 300 / 1.5);
            $image_resize->save(public_path('style_images/' . $imageName));

            $data['back_preview_image_url'] = $baseUrl . '/' . $imageName;
        }

        $result = $this->baseService->update($id, $data);

        if ($result) {
            $result = $this->baseService->read($id);
            return $result
                ? $this->responseWithSuccess($result, 'update.success')
                : $this->responseWithError(__('error.update.fail'));
        }

        return $this->responseWithError(__('error.update.fail'), 421);
    }
}
