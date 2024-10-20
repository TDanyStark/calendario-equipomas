<?php

declare(strict_types=1);

namespace App\Application\Actions\Auth;

use App\Application\Actions\Action;
use App\Domain\Student\StudentRepository;
use App\Domain\Professor\ProfessorRepository;
use Firebase\JWT\JWT;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;
use Psr\Log\LoggerInterface;

class LoginAction extends Action
{
    private StudentRepository $studentRepository;
    private ProfessorRepository $professorRepository;
    private string $jwtSecret;

    public function __construct(
        LoggerInterface $logger,
        StudentRepository $studentRepository,
        ProfessorRepository $professorRepository,
        string $jwtSecret
    ) {
        parent::__construct($logger);
        $this->studentRepository = $studentRepository;
        $this->professorRepository = $professorRepository;
        $this->jwtSecret = $jwtSecret;
    }

    /**
     * @throws HttpBadRequestException
     */
    protected function action(): Response
    {
        $data = $this->getFormData();

        if (!isset($data['email'], $data['password'])) {
            throw new HttpBadRequestException($this->request, "Email and password are required.");
        }

        $email = $data['email'];
        $password = $data['password'];

        // Buscar en la tabla de Students
        $student = $this->studentRepository->findStudentByEmail($email);
        if ($student && $student->getStudentID() === $password) {
            $token = $this->generateJWT($student->getFirstName(), $student->getEmail(), 'student');
            $this->logger->info("Login successful for student: {$email}");
            return $this->respondWithToken($token);
        }

        // Buscar en la tabla de Professors si no lo encuentra en Students
        $professor = $this->professorRepository->findProfessorByEmail($email);
        if ($professor && $professor->getProfessorID() === $password) {
            $token = $this->generateJWT($professor->getFirstName(), $professor->getEmail(), 'professor');
            $this->logger->info("Login successful for professor: {$email}");
            return $this->respondWithToken($token);
        }

        // Si no se encuentra ni en estudiantes ni en profesores
        $this->logger->warning("Login failed for email: {$email}");
        return $this->respondWithError('Invalid email or password', 401);
    }

    private function generateJWT(string $name, string $email, string $role): string
    {
        $now = new \DateTime();
        $future = new \DateTime("now +1 week");
        // $test = new \DateTime("now +1 minute");

        $payload = [
            'iat' => $now->getTimeStamp(),
            'exp' => $future->getTimeStamp(),
            'name' => $name,
            'email' => $email,
            'role' => $role,
        ];

        return JWT::encode($payload, $this->jwtSecret, 'HS256');
    }

    private function respondWithToken(string $token): Response
    {
        $data = [
            'JWT' => $token,
        ];

        return $this->respondWithData($data);
    }

    private function respondWithError(string $message, int $status): Response
    {
        return $this->respondWithData(['message' => $message], $status);
    }
}
