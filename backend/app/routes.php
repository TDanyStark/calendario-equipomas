<?php

declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;
use App\Application\Actions\Student\ListStudentsAction;
use App\Application\Actions\Auth\LoginAction;
use App\Application\Actions\Auth\ValidateJWTAction;

use App\Application\Actions\Instrument\ListInstrumentsAction;
use App\Application\Actions\Instrument\CreateInstrumentAction;
use App\Application\Actions\Instrument\UpdateInstrumentAction;
use App\Application\Actions\Instrument\DeleteInstrumentAction;
use App\Application\Actions\Instrument\DeleteMultipleInstrumentsAction;

use App\Application\Middleware\RoleMiddleware;

return function (App $app) {
    $app->options('/{routes:.*}', function (Request $request, Response $response) {
        // CORS Pre-Flight OPTIONS Request Handler
        return $response;
    });

    $app->group('/api', function (Group $group) {
        $group->post('/login', LoginAction::class);
        $group->post('/validateJWT', ValidateJWTAction::class);
        $group->get('/students', ListStudentsAction::class);

        $group->group('/instruments', function (Group $instrumentGroup) {
            $instrumentGroup->get('', ListInstrumentsAction::class);
            $instrumentGroup->post('', CreateInstrumentAction::class);
            $instrumentGroup->put('/{id}', UpdateInstrumentAction::class);
            $instrumentGroup->delete('/{id}', DeleteInstrumentAction::class);

            $instrumentGroup->delete('', DeleteMultipleInstrumentsAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));
    });
};
