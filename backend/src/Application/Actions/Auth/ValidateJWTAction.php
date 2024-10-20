<?php

declare(strict_types=1);

namespace App\Application\Actions\Auth;

use App\Application\Actions\Action;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;
use Psr\Log\LoggerInterface;

class ValidateJWTAction extends Action
{
    private string $jwtSecret;

    public function __construct(
        LoggerInterface $logger,
        string $jwtSecret
    ) {
        parent::__construct($logger);
        $this->jwtSecret = $jwtSecret;
    }

    public function action(): Response {
        // Obtén la cabecera Authorization
        $authHeader = $this->request->getHeaderLine('Authorization');

        // Verifica que se haya proporcionado la cabecera Authorization
        if (!$authHeader) {
            throw new HttpBadRequestException($this->request, "Authorization header is required.");
        }

        // Verifica que el token sea del tipo Bearer
        if (strpos($authHeader, 'Bearer ') !== 0) {
            throw new HttpBadRequestException($this->request, "Authorization header must start with 'Bearer'.");
        }

        // Extrae el token JWT de la cabecera
        $JWT = substr($authHeader, 7); // Remueve 'Bearer '
        try {
            // Intenta decodificar el JWT con la clave secreta
            $decoded = JWT::decode($JWT, new Key($this->jwtSecret, 'HS256'));

            // Si el token es válido, responde con la información decodificada
            $response_data = [
                'isValid' => true,
                'infoJWT' => $decoded // Puedes devolver los datos del JWT si lo necesitas
            ];

        } catch (\Firebase\JWT\ExpiredException $e) {
            // Si el token ha expirado, responde indicando que no es válido
            $response_data = [
                'isValid' => false,
                'message' => 'Token has expired.'
            ];
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            // Si la firma del token es inválida
            $response_data = [
                'isValid' => false,
                'message' => 'Invalid token signature.'
            ];
        } catch (\Exception $e) {
            // Si ocurre cualquier otro error
            $response_data = [
                'isValid' => false,
                'message' => 'Invalid token.',
                'error' => $e->getMessage()
            ];
        }

        return $this->respondWithData($response_data);
    }
}
