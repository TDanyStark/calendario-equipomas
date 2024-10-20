<?php

declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;
use App\Application\Actions\Student\ListStudentsAction;
use App\Application\Actions\Auth\LoginAction;
use App\Application\Actions\Auth\ValidateJWTAction;

return function (App $app) {
    $app->options('/{routes:.*}', function (Request $request, Response $response) {
        // CORS Pre-Flight OPTIONS Request Handler
        return $response;
    });

    $app->group('/api', function (Group $group) {
        $group->post('/login', LoginAction::class);
        $group->post('/validateJWT', ValidateJWTAction::class);
        $group->get('/students', ListStudentsAction::class);
    });
    
};
