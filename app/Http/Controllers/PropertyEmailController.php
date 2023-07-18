<?php
namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreatePropertyEmailRequest;
use App\Http\Requests\UpdatePropertyEmailRequest;
use App\Services\PropertyEmailService;

/**
 * Class PropertyEmailController
 *
 * @package App\Http\Controllers
 */
class PropertyEmailController extends Controller
{
    /**
     * constructor.
     *
     * @param PropertyEmailService $propertyEmailService
     */
    public function __construct(PropertyEmailService $propertyEmailService)
    {
        $this->baseService = $propertyEmailService;
    }

    public function create(CreatePropertyEmailRequest $request)
    {
        $email = $request->get('email');
        $propertyId = $request->get('property_id');
        $request->validate([
            'email' => [
                'required',
                 Rule::unique('property_emails')->where(function ($query) use($email, $propertyId) {
                   return $query->where('email', $email)->where('property_id', $propertyId);
                 })
            ]
        ]);
        return $this->add($request);
    }

    public function update(UpdatePropertyEmailRequest $request, $id)
    {
        $email = $request->get('email');
        $property = $this->baseService->read($id);
        $propertyId = $property['property_id'];
        $request->validate([
            'email' => [
                'required',
                 Rule::unique('property_emails')->where(function ($query) use($email, $id, $propertyId) {
                   return $query->where('email', $email)->where('id', '!=', $id)->where('property_id', $propertyId);
                 })
            ]
        ]);
        return $this->updateData($request, $id);
    }
}
