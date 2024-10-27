<?php

declare(strict_types=1);

namespace App\Domain\Shared\Settings;

use JsonSerializable;

class Setting implements JsonSerializable
{
    private string $id;
    private string $name;
    private string $value;

    public function __construct(string $id, string $name, string $value)
    {
        $this->id = $id;
        $this->name = $name;
        $this->value = $value;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'value' => $this->value,
        ];
    }
}