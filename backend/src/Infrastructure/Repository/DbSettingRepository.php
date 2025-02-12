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
        $stmt = $this->pdo->prepare('UPDATE settings SET SettingValue = :value WHERE SettingID  = :id');
        $SettingID = $setting->getId();
        $SettingValue = $setting->getValue();
        $stmt->bindParam(':value', $SettingValue, PDO::PARAM_STR);
        $stmt->bindParam(':id', $SettingID, PDO::PARAM_STR);
        $stmt->execute();
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

    public function save(Setting $setting): void
    {
        $stmt = $this->pdo->prepare('INSERT INTO settings (SettingName, SettingValue) VALUES (:SettingName, :SettingValue)');
        $stmt->execute(['SettingName' => $setting->getName(), 'SettingValue' => $setting->getValue()]);
    }
}
