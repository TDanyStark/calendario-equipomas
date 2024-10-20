<?php

declare(strict_types=1);

namespace App\Application\Actions\Auth;

use App\Application\Actions\Action;
use App\Domain\Admin\Admin;
use App\Domain\Student\StudentRepository;
use App\Domain\Professor\ProfessorRepository;
use Firebase\JWT\JWT;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;
use Psr\Log\LoggerInterface;
use App\Domain\Admin\AdminRepository;
use App\Domain\Professor\Professor;
use App\Domain\Role\Role;
use App\Domain\User\User;
use App\Domain\User\UserRepository;
use App\Domain\Role\RoleRepository;
use App\Domain\Student\Student;

class LoginAction extends Action
{
    private UserRepository $userRepository;
    private AdminRepository $adminRepository;
    private StudentRepository $studentRepository;
    private ProfessorRepository $professorRepository;
    private RoleRepository $roleRepository;
    private string $jwtSecret;

    public function __construct(
        LoggerInterface $logger,
        UserRepository $userRepository,
        AdminRepository $adminRepository,
        StudentRepository $studentRepository,
        ProfessorRepository $professorRepository,
        RoleRepository $roleRepository,
        string $jwtSecret
    ) {
        parent::__construct($logger);
        $this->userRepository = $userRepository;
        $this->adminRepository = $adminRepository;
        $this->studentRepository = $studentRepository;
        $this->professorRepository = $professorRepository;
        $this->roleRepository = $roleRepository;
        $this->jwtSecret = $jwtSecret;
    }

    /**
     * @throws HttpBadRequestException
     */
    protected function action(): Response
    {
        $data = $this->getFormData();

        if (!isset($data['id'], $data['password'])) {
            throw new HttpBadRequestException($this->request, "ID and password are required.");
        }

        $id = $data['id'];
        $password = $data['password'];

        $user = $this->userRepository->findUserById($id);

        if ($user === null) {
            return $this->respondWithError('Invalid email or password', 401);
        }

        if ($user->getPassword() !== $password) {
            return $this->respondWithError('Invalid email or password', 401);
        }

        // Obtener el rol utilizando el RoleRepository
        $role = $this->roleRepository->getRoleById($user->getRoleID());

        switch ($role->getRoleName()) {
            case 'admin':
                $user = $this->adminRepository->findAdminById($id);
                if ($user === null) {
                    return $this->respondWithError('Error al obtener el usuario Error:3', 401);
                }
                break;
            case 'student':
                $user = $this->studentRepository->findStudentOfId($id);
                if ($user === null) {
                    return $this->respondWithError('Error al obtener el usuario Error:2', 401);
                }
                break;
            case 'professor':
                $user = $this->professorRepository->findProfessorById($id);
                if ($user === null) {
                    return $this->respondWithError('Error al obtener el usuario Error:1', 401);
                }
                break;
            default:
                return $this->respondWithError('Error al obtener el Rol, consulte al administrador', 401);
        }

        if ($role === null) {
            return $this->respondWithError('Role not found', 401);
        }

        // Generar el token JWT
        $token = $this->generateJWT($user->getFirstName(), $user->getUser()->getEmail(), $role->getRoleName());

        // Responder con el token
        return $this->respondWithToken($token);

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
