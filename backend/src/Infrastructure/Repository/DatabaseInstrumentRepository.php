<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Instrument\Instrument;
use App\Domain\Instrument\InstrumentRepository;
use App\Infrastructure\Database;
use PDO;

class DatabaseInstrumentRepository implements InstrumentRepository
{
    private PDO $pdo;

    public function __construct(Database $database)
    {
        $this->pdo = $database->getConnection();
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM instruments');
        $instruments = [];
        while ($row = $stmt->fetch()) {
            $instruments[] = new Instrument((string)$row['InstrumentID'], $row['InstrumentName'], $row['Created_at'], $row['Updated_at']);
        }
        return $instruments;
    }

    public function findById(string $instrumentID): ?Instrument
    {
        $stmt = $this->pdo->prepare('SELECT * FROM instruments WHERE InstrumentID = :id');
        $stmt->execute(['id' => $instrumentID]);
        $row = $stmt->fetch();
        if ($row) {
            return new Instrument($row['InstrumentID'], $row['InstrumentName'], $row['Created_at'], $row['Updated_at']);
        }
        return null;
    }

    public function create(Instrument $instrument): void
    {
        $stmt = $this->pdo->prepare('INSERT INTO instruments (InstrumentName) VALUES (:name)');
        $stmt->execute([
            'name' => $instrument->getInstrumentName(),
        ]);
    }

    public function update(string $instrumentID, Instrument $instrument): void
    {
        $stmt = $this->pdo->prepare('UPDATE instruments SET InstrumentName = :name WHERE InstrumentID = :id');
        $stmt->execute([
            'id' => $instrumentID,
            'name' => $instrument->getInstrumentName(),
        ]);
    }

    public function delete(string $instrumentID): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM instruments WHERE InstrumentID = :id');
        $stmt->execute(['id' => $instrumentID]);
    }

    public function deleteMultiple(array $ids): int
    {
        // Genera un string de placeholders para la consulta SQL
        $placeholders = implode(',', array_fill(0, count($ids), '?'));

        $query = "DELETE FROM instruments WHERE InstrumentID IN ($placeholders)";
        $stmt = $this->pdo->prepare($query);

        // Ejecuta la consulta pasando los IDs como parámetros
        $stmt->execute($ids);

        return $stmt->rowCount(); // Retorna la cantidad de filas afectadas
    }

    public function findInstrumentByQuery(string $query): array
    {
        $searchQuery = "%$query%";

        $stmt = $this->pdo->prepare('
            SELECT i.InstrumentID, i.InstrumentName
            FROM instruments i
            WHERE i.InstrumentName LIKE :query
            ORDER BY i.InstrumentName ASC
            LIMIT 5
        ');
        $stmt->bindParam(':query', $searchQuery, PDO::PARAM_STR);
        $stmt->execute();

        $instruments = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $instruments[] = Array(
                'id' => $row['InstrumentID'],
                'name' => $row['InstrumentName']
            );
        }

        return $instruments;
    }
}
