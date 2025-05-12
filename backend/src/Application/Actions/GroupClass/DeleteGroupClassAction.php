<?php

declare(strict_types=1);

namespace App\Application\Actions\GroupClass;

use App\Domain\GroupClass\GroupClassRepository;
use App\Domain\AcademicPeriod\AcademicPeriodRepository;
use App\Domain\Shared\Days\ScheduleDayRepository;
use App\Domain\Shared\Settings\SettingRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Log\LoggerInterface;
use Slim\Exception\HttpBadRequestException;

class DeleteGroupClassAction extends GroupClassAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $groupClassId = (int) $this->resolveArg('id');

        if ($groupClassId <= 0) {
            throw new HttpBadRequestException($this->request, 'Group Class ID must be a positive integer.');
        }

        $success = $this->groupClassRepository->delete($groupClassId);

        if ($success) {
            $this->logger->info("Group class with id `{$groupClassId}` was deleted.");
            return $this->respondWithData(['message' => 'Group class deleted successfully']);
        } else {
            $this->logger->warning("Group class with id `{$groupClassId}` not found or could not be deleted.");
            return $this->respondWithData(['message' => 'Group class not found or could not be deleted'], 404); 
        }
    }
}
