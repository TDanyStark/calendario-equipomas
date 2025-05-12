<?php

declare(strict_types=1);

namespace App\Application\Actions\GroupClass;

use App\Domain\AcademicPeriod\AcademicPeriodRepository; // Keep for clarity or future use if needed by GroupClassAction context
use App\Domain\Shared\Days\ScheduleDayRepository;    // Keep for clarity or future use if needed by GroupClassAction context
use App\Domain\Shared\Settings\SettingRepository;  // Keep for clarity or future use if needed by GroupClassAction context
use App\Domain\GroupClass\GroupClassRepository; // Already present, used by $this->groupClassRepository
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;

class DeleteMultipleGroupClassesAction extends GroupClassAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $data = $this->getFormData();
        $ids = $data['ids'] ?? [];

        if (empty($ids) || !is_array($ids)) {
            throw new HttpBadRequestException($this->request, 'No group class IDs provided or invalid format.');
        }

        $validatedIds = [];
        foreach ($ids as $id) {
            $intId = filter_var($id, FILTER_VALIDATE_INT);
            if ($intId === false || $intId <= 0) {
                throw new HttpBadRequestException($this->request, "Invalid Group Class ID: {$id}. All IDs must be positive integers.");
            }
            $validatedIds[] = $intId;
        }

        if (empty($validatedIds)) {
            throw new HttpBadRequestException($this->request, 'No valid group class IDs provided after validation.');
        }

        $deletedCount = $this->groupClassRepository->deleteMultiple($validatedIds);

        $this->logger->info("Attempted to delete multiple group classes. IDs: " . implode(', ', $validatedIds) . ". Actually deleted: {$deletedCount}");
        return $this->respondWithData(['message' => "Successfully processed deletion for {$deletedCount} group classes"]);
    }
}
