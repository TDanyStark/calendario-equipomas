<?php

declare(strict_types=1);

namespace App\Application\Actions\Setting;

use Psr\Http\Message\ResponseInterface as Response;

use App\Domain\Shared\Settings\Setting;


class ChangeSettingAction extends SettingAction
{
  protected function action(): Response
  {
    $data = $this->getFormData();
    $setting = new Setting(
      $data['settingID'],
      "",
      $data['settingValue']
    );
    $this->settingRepository->updateSetting($setting);
    return $this->respondWithData($data);
  }
}