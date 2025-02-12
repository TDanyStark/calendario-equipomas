<?php

declare(strict_types=1);

namespace App\Domain\Shared\Settings;

use App\Domain\Shared\Settings\Setting;

interface SettingRepository
{
    /**
     * Obtiene todas las configuraciones del sistema.
     *
     * @return Setting un objeto Setting.
     */
    public function findSetting(string $name): Setting;

    /**
     * Actualiza una configuración del sistema.
     *
     * @param Setting $setting
     * @return void
     */
    public function updateSetting(Setting $setting): void;

    /**
     * Obtiene todas las configuraciones del sistema.
     *
     * @return Setting[] Arreglo de objetos Setting.
     */
    public function findAll(): array;

    public function save(Setting $setting): void;
}