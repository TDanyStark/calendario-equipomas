<?php

declare(strict_types=1);

namespace App\Application\Actions\GroupClass;

use App\Domain\GroupClass\GroupClass;
use Psr\Http\Message\ResponseInterface as Response;
use App\Domain\DomainException\DomainRecordNotFoundException;

class UpdateGroupClassAction extends GroupClassAction
{
    protected function action(): Response
    {
        $id = (int) $this->resolveArg('id');
        $data = $this->request->getParsedBody();
        
        // First check if the GroupClass exists
        $existingGroupClass = $this->groupClassRepository->findById($id);
        
        if (!$existingGroupClass) {
            return $this->respondWithData([
                'error' => true,
                'message' => "GroupClass with ID {$id} not found."
            ], 404);
        }
        
        // Get the current academic period ID
        $academicPeriodId = $existingGroupClass->getAcademicPeriodId();
        
        // Create a new GroupClass object with updated data
        $updatedGroupClass = new GroupClass(
            $id,
            $data['name'],
            $data['roomId'],
            $academicPeriodId,
            $data['dayId'],
            $data['startTime'],
            $data['endTime'],
            $data['professors'] ?? [],
            $data['enrollments'] ?? []
        );
        
        // Update the GroupClass
        $success = $this->groupClassRepository->update($updatedGroupClass);
        
        if (!$success) {
            return $this->respondWithData([
                'error' => true,
                'message' => "Failed to update GroupClass with ID {$id}."
            ], 500);
        }
          return $this->respondWithData([
            'success' => true,
            'message' => 'GroupClass updated successfully'
        ]);
    }
}
