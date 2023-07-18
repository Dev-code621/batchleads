<?php

namespace App\Http\Resources;

use App\Models\Folder;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class FolderResource
 *
 * @package App\Http\Resources
 */
class FolderResource extends JsonResource
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
      'id'      => $this->id,
      'user_id' => $this->user_id,
      'name'    => $this->name,
      'color'   => $this->color,
      'icon'    => $this->icon,
    ];
  }
}
