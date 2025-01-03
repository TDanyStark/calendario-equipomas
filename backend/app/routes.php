<?php

declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;
use App\Application\Actions\Auth\LoginAction;
use App\Application\Actions\Auth\ValidateJWTAction;

use App\Application\Actions\Instrument\ListInstrumentsAction;
use App\Application\Actions\Instrument\CreateInstrumentAction;
use App\Application\Actions\Instrument\UpdateInstrumentAction;
use App\Application\Actions\Instrument\DeleteInstrumentAction;
use App\Application\Actions\Instrument\DeleteMultipleInstrumentsAction;

use App\Application\Actions\Room\ListRoomsAction;
use App\Application\Actions\Room\CreateRoomAction;
use App\Application\Actions\Room\UpdateRoomAction;
use App\Application\Actions\Room\DeleteRoomAction;
use App\Application\Actions\Room\DeleteMultipleRoomsAction;

use App\Application\Actions\Course\ListCoursesAction;
use App\Application\Actions\Course\CreateCourseAction;
use App\Application\Actions\Course\UpdateCourseAction;
use App\Application\Actions\Course\DeleteCourseAction;
use App\Application\Actions\Course\DeleteMultipleCourseAction;

use App\Application\Actions\Semester\ListSemestersAction;
use App\Application\Actions\Semester\CreateSemesterAction;
use App\Application\Actions\Semester\UpdateSemesterAction;
use App\Application\Actions\Semester\DeleteSemesterAction;
use App\Application\Actions\Semester\DeleteMultipleSemestersAction;

use App\Application\Actions\Professor\ListProfessorsAction;
use App\Application\Actions\Professor\CreateProfessorAction;
use App\Application\Actions\Professor\UpdateProfessorAction;
use App\Application\Actions\Professor\DeleteProfessorAction;
use App\Application\Actions\Professor\DeleteMultipleProfessorsAction;

use App\Application\Actions\Days\ScheduleDaysAction;

use App\Application\Middleware\RoleMiddleware;

return function (App $app) {
    $app->options('/{routes:.*}', function (Request $request, Response $response) {
        // CORS Pre-Flight OPTIONS Request Handler
        return $response;
    });

    $app->group('/api', function (Group $group) {
        $group->post('/login', LoginAction::class);
        $group->post('/validateJWT', ValidateJWTAction::class);
        $group->get('/schedule/days', ScheduleDaysAction::class);

        $group->group('/instruments', function (Group $instrumentGroup) {
            $instrumentGroup->get('', ListInstrumentsAction::class);
            $instrumentGroup->post('', CreateInstrumentAction::class);
            $instrumentGroup->put('/{id}', UpdateInstrumentAction::class);
            $instrumentGroup->delete('/{id}', DeleteInstrumentAction::class);
            $instrumentGroup->delete('', DeleteMultipleInstrumentsAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));

        $group->group('/rooms', function (Group $roomGroup) {
            $roomGroup->get('', ListRoomsAction::class);
            $roomGroup->post('', CreateRoomAction::class);
            $roomGroup->put('/{id}', UpdateRoomAction::class);
            $roomGroup->delete('/{id}', DeleteRoomAction::class);
            $roomGroup->delete('', DeleteMultipleRoomsAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));

        $group->group('/courses', function (Group $courseGroup) {
            $courseGroup->get('', ListCoursesAction::class);
            $courseGroup->post('', CreateCourseAction::class);
            $courseGroup->put('/{id}', UpdateCourseAction::class);
            $courseGroup->delete('/{id}', DeleteCourseAction::class);
            $courseGroup->delete('', DeleteMultipleCourseAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));

        $group->group('/semesters', function (Group $semesterGroup) {
            $semesterGroup->get('', ListSemestersAction::class);
            $semesterGroup->post('', CreateSemesterAction::class);
            $semesterGroup->put('/{id}', UpdateSemesterAction::class);
            $semesterGroup->delete('/{id}', DeleteSemesterAction::class);
            $semesterGroup->delete('', DeleteMultipleSemestersAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));
        
        $group->group('/professors', function (Group $professorGroup) {
            $professorGroup->get('', ListProfessorsAction::class);
            $professorGroup->post('', CreateProfessorAction::class);
            $professorGroup->put('/{id}', UpdateProfessorAction::class);
            $professorGroup->delete('/{id}', DeleteProfessorAction::class);
            $professorGroup->delete('', DeleteMultipleProfessorsAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));
        
    });
};
