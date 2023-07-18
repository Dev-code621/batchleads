<?php

namespace App\Http\Resources;

use App\Models\Folder;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class PropertyResource
 *
 * @package App\Http\Resources
 */
class PropertyResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @param  \Illuminate\Http\Request $request
   *
   * @return array
   */
  public function toArray($request)
  {
    /** @var $this Folder */
    return [
        'id'                  => $this->id,
        'folder_id'           => $this->folder_id,
        'address1'            => $this->address1,
        'address2'            => $this->address2,
        'location_latitude'   => $this->location_latitude,
        'location_longitude'  => $this->location_longitude,
        'photo_id'            => $this->photo_id,
        'contact_info_id'     => $this->contact_info_id,
        'status'              => $this->status,
    ];
  }
}
