<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Shared\Settings\Setting;
use App\Domain\Shared\Settings\SettingRepository;
use App\Infrastructure\Database;
use PDO;

class DbSettingRepository implements SettingRepository
{
    private PDO $pdo;

    public function __construct(Database $database)
    {
        $this->pdo = $database->getConnection();
    }

    public function findSetting(string $name): Setting
    {
        $stmt = $this->pdo->prepare('SELECT * FROM settings WHERE SettingName = :SettingName');
        $stmt->execute(['SettingName' => $name]);
        $setting = $stmt->fetch();
        return new Setting((string)$setting['SettingID'], $setting['SettingName'], $setting['SettingValue']);
    }

    public function updateSetting(Setting $setting): void
    {
        $stmt = $this->pdo->prepare('UPDATE settings SET value = :value WHERE id = :id');
        $stmt->execute(['SettingValue' => $setting->getValue(), 'SettingID' => $setting->getId()]);
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM settings');
        $stmt->execute();
        $settings = $stmt->fetchAll();
        return array_map(function ($setting) {
            return new Setting((string)$setting['SettingID'], $setting['SettingName'], $setting['SettingValue']);
        }, $settings);
    }
}
