<?php

declare(strict_types=1);

namespace App\Application\Actions\Setting;

use App\Application\Actions\Action;
use App\Domain\Shared\Settings\SettingRepository;
use Psr\Log\LoggerInterface;

abstract class SettingAction extends Action
{
  protected SettingRepository $settingRepository;

  public function __construct(LoggerInterface $logger, SettingRepository $settingRepository)
  {
    parent::__construct($logger);
    $this->settingRepository = $settingRepository;
  }
}
