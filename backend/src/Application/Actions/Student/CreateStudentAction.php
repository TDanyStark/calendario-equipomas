<?php

declare(strict_types=1);

namespace App\Application\Actions\Student;

use App\Domain\Student\Student;
use App\Domain\User\User;
use Psr\Http\Message\ResponseInterface as Response;

class CreateStudentAction extends StudentAction
{
  protected function action(): Response
  {
    $data = $this->request->getParsedBody();
    $ID = (string)$data['id'];
    if ($ID == null) {
      return $this->respondWithData(['error' => 'ID is required'], 400);
    }
    // el id del rol de estudiante es 1
    $user = new User($ID, $data['user']['email'], $ID, 1); // se pasa el id del estudiante como contraseña, ya luego el decide cambiarla

    $student = new Student($ID, $data['firstName'], $data['lastName'],  $data['phone'], $data['status'], $user);

    try {
      $id = $this->studentRepository->create($student);
      return $this->respondWithData(['id' => $id], 201);
    } catch (\DomainException $e) {
      // Manejar la excepción personalizada
      return $this->respondWithData(['error' => "Ya existe un estudiantes registrado con ese numero de cédula"], 400);
    } catch (\Exception $e) {
      // Manejar otras excepciones genéricas
      return $this->respondWithData(['error' => 'Error interno en el servidor', $e->getMessage()], 500);
    }
  }
}
