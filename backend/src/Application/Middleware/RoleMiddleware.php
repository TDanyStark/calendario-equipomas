<?php

declare(strict_types=1);

namespace App\Application\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Exception\HttpForbiddenException;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Log\LoggerInterface; // Importar LoggerInterface


class RoleMiddleware implements MiddlewareInterface
{
    private string $jwtSecret;
    private ?string $requiredRole = null;

    public function __construct(string $jwtSecret)
    {
        $this->jwtSecret = $jwtSecret;
    }

    // Implementar el método process para cumplir con la interfaz
    public function process(Request $request, RequestHandlerInterface $handler): Response
    {
        if ($this->requiredRole === null) {
            throw new \RuntimeException("No role specified for RoleMiddleware");
        }

        $authHeader = $request->getHeader('Authorization');

        if (empty($authHeader) || count($authHeader) === 0) {
            throw new HttpForbiddenException($request, "No token provided");
        }

        if (strpos($authHeader[0], 'Bearer ') !== 0) {
            throw new HttpForbiddenException($request, "Invalid token format");
        }

        $token = trim(str_replace('Bearer', '', $authHeader[0]));

        if (empty($token)) {
            throw new HttpForbiddenException($request, "Token is missing");
        }

        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));

            // Verificar el rol en el token
            if (!isset($decoded->role) || $decoded->role !== $this->requiredRole) {
                throw new HttpForbiddenException($request, "User does not have the required role");
            }

        } catch (\Exception $e) {
            throw new HttpForbiddenException($request, "Invalid or expired token". $e->getMessage());
        }

        return $handler->handle($request);
    }

    // Método para establecer dinámicamente el rol
    public function withRole(string $role): RoleMiddleware
    {
        $clone = clone $this;  // Clonar la instancia actual del middleware
        $clone->requiredRole = $role;
        return $clone;
    }
}
