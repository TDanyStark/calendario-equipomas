<?php

declare(strict_types=1);

namespace App\Application\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface as Middleware;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as SlimResponse;

class CorsMiddleware implements Middleware
{
    public function process(Request $request, RequestHandler $handler): Response
    {
        $origin = $request->getHeaderLine('Origin');

        // Aquí puedes especificar los orígenes permitidos
        $allowedOrigins = ['http://localhost:5173'];

        // Si el origen está permitido
        if (in_array($origin, $allowedOrigins)) {

            // Manejo especial para las solicitudes preflight (OPTIONS)
            if ($request->getMethod() === 'OPTIONS') {
                $response = new SlimResponse();
                return $this->addCorsHeaders($response, $origin);
            }

            // Si no es una solicitud preflight, pasa al siguiente middleware/controlador
            $response = $handler->handle($request);
            return $this->addCorsHeaders($response, $origin);
        }

        // Si el origen no está permitido, continuar sin modificar las cabeceras
        return $handler->handle($request);
    }

    // Método auxiliar para añadir las cabeceras CORS
    private function addCorsHeaders(Response $response, string $origin): Response
    {
        return $response
            ->withHeader('Access-Control-Allow-Origin', $origin)
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->withHeader('Access-Control-Allow-Credentials', 'true');  // Solo si es necesario usar credenciales
    }
}
  