<?php

declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;
use App\Application\Actions\Auth\LoginAction;
use App\Application\Actions\Auth\ValidateJWTAction;

use App\Application\Actions\Instrument\ListInstrumentsAction;
use App\Application\Actions\Instrument\GetInstrumentsQueryAction;
use App\Application\Actions\Instrument\CreateInstrumentAction;
use App\Application\Actions\Instrument\UpdateInstrumentAction;
use App\Application\Actions\Instrument\DeleteInstrumentAction;
use App\Application\Actions\Instrument\DeleteMultipleInstrumentsAction;

use App\Application\Actions\Room\ListRoomsAction;
use App\Application\Actions\Room\GetRoomsQueryAction;
use App\Application\Actions\Room\CreateRoomAction;
use App\Application\Actions\Room\UpdateRoomAction;
use App\Application\Actions\Room\DeleteRoomAction;
use App\Application\Actions\Room\DeleteMultipleRoomsAction;

use App\Application\Actions\Course\ListCoursesAction;
use App\Application\Actions\Course\GetCoursesQueryAction;
use App\Application\Actions\Course\CreateCourseAction;
use App\Application\Actions\Course\UpdateCourseAction;
use App\Application\Actions\Course\DeleteCourseAction;
use App\Application\Actions\Course\DeleteMultipleCourseAction;

use App\Application\Actions\Semester\ListSemestersAction;
use App\Application\Actions\Semester\GetSemestersQueryAction;
use App\Application\Actions\Semester\CreateSemesterAction;
use App\Application\Actions\Semester\UpdateSemesterAction;
use App\Application\Actions\Semester\DeleteSemesterAction;
use App\Application\Actions\Semester\DeleteMultipleSemestersAction;

use App\Application\Actions\Professor\ListProfessorsAction;
use App\Application\Actions\Professor\ListProfessorIdsActiveAction;
use App\Application\Actions\Professor\GetProfessorQueryAction;
use App\Application\Actions\Professor\GetProfessorAction;
use App\Application\Actions\Professor\CreateProfessorAction;
use App\Application\Actions\Professor\UpdateProfessorAction;
use App\Application\Actions\Professor\DeleteProfessorAction;
use App\Application\Actions\Professor\DeleteMultipleProfessorsAction;
use App\Application\Actions\Professor\SeedProfessorsAction;
use App\Application\Actions\Professor\AssignProfessorAction;
use App\Application\Actions\Professor\GetAssignProfessorAction;
use App\Application\Actions\Professor\GetOnlyAssignProfessorAction;
use App\Application\Actions\Professor\ListOnlyAssignIdsActiveAction;

use App\Application\Actions\Student\ListStudentsAction;
use App\Application\Actions\Student\CreateStudentAction;
use App\Application\Actions\Student\UpdateStudentAction;
use App\Application\Actions\Student\DeleteStudentAction;
use App\Application\Actions\Student\DeleteMultipleStudentsAction;
use App\Application\Actions\Student\GetStudentsQueryAction;


use App\Application\Actions\Days\ScheduleDaysAction;

use App\Application\Middleware\RoleMiddleware;

use App\Application\Actions\Enrollment\ListEnrollmentAction;
use App\Application\Actions\Enrollment\CreateEnrollmentAction;
use App\Application\Actions\Enrollment\ListEnrollmentIdsActiveAction;
use App\Application\Actions\Enrollment\GetEnrollmentsQueryAction;
use App\Application\Actions\Enrollment\UpdateEnrollmentAction;
use App\Application\Actions\Enrollment\UpdateGroupAction;
use App\Application\Actions\Enrollment\DeleteEnrollmentAction;
use App\Application\Actions\Enrollment\DeleteMultipleEnrollmentsAction;

use App\Application\Actions\AcademicPeriod\ListAcademicPeriodsAction;
use App\Application\Actions\Setting\ChangeSettingAction;
use App\Application\Actions\AcademicPeriod\SelectAcademicPeriodAction;
use App\Application\Actions\AcademicPeriod\CreateAcademicPeriodAction;
use App\Application\Actions\AcademicPeriod\GetSelectedAcademicPeriod;


use App\Application\Actions\GroupClass\ListGroupClassAction;
use App\Application\Actions\GroupClass\AvailabilityByRoomGroupClassAction;
use App\Application\Actions\GroupClass\CreateGroupClassAction;


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
            $instrumentGroup->get('/query', GetInstrumentsQueryAction::class);
            $instrumentGroup->post('', CreateInstrumentAction::class);
            $instrumentGroup->put('/{id}', UpdateInstrumentAction::class);
            $instrumentGroup->delete('/{id}', DeleteInstrumentAction::class);
            $instrumentGroup->delete('', DeleteMultipleInstrumentsAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));

        $group->group('/rooms', function (Group $roomGroup) {
            $roomGroup->get('', ListRoomsAction::class);
            $roomGroup->get('/query', GetRoomsQueryAction::class);
            $roomGroup->post('', CreateRoomAction::class);
            $roomGroup->put('/{id}', UpdateRoomAction::class);
            $roomGroup->delete('/{id}', DeleteRoomAction::class);
            $roomGroup->delete('', DeleteMultipleRoomsAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));

        $group->group('/courses', function (Group $courseGroup) {
            $courseGroup->get('', ListCoursesAction::class);
            $courseGroup->get('/query', GetCoursesQueryAction::class);
            $courseGroup->post('', CreateCourseAction::class);
            $courseGroup->put('/{id}', UpdateCourseAction::class);
            $courseGroup->delete('/{id}', DeleteCourseAction::class);
            $courseGroup->delete('', DeleteMultipleCourseAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));

        $group->group('/semesters', function (Group $semesterGroup) {
            $semesterGroup->get('', ListSemestersAction::class);
            $semesterGroup->get('/query', GetSemestersQueryAction::class);
            $semesterGroup->post('', CreateSemesterAction::class);
            $semesterGroup->put('/{id}', UpdateSemesterAction::class);
            $semesterGroup->delete('/{id}', DeleteSemesterAction::class);
            $semesterGroup->delete('', DeleteMultipleSemestersAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));

        $group->group('/professors', function (Group $professorGroup) {
            $professorGroup->get('', ListProfessorsAction::class);
            $professorGroup->get('/query', GetProfessorQueryAction::class);
            $professorGroup->post('/assign', AssignProfessorAction::class);
            $professorGroup->get('/assign', GetAssignProfessorAction::class);
            $professorGroup->get('/only/assign', GetOnlyAssignProfessorAction::class);
            $professorGroup->get('/only/assign/idsactive', ListOnlyAssignIdsActiveAction::class);
            $professorGroup->get('/idsactive', ListProfessorIdsActiveAction::class);
            $professorGroup->get('/{id}', GetProfessorAction::class);
            $professorGroup->post('', CreateProfessorAction::class);
            $professorGroup->put('/{id}', UpdateProfessorAction::class);
            $professorGroup->delete('/{id}', DeleteProfessorAction::class);
            $professorGroup->delete('', DeleteMultipleProfessorsAction::class);
            // $professorGroup->get('/seed', SeedProfessorsAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));

        $group->group('/students', function (Group $studentGroup) {
            $studentGroup->get('', ListStudentsAction::class);
            $studentGroup->get('/query', GetStudentsQueryAction::class);
            $studentGroup->post('', CreateStudentAction::class);
            $studentGroup->put('/{id}', UpdateStudentAction::class);
            $studentGroup->delete('/{id}', DeleteStudentAction::class);
            $studentGroup->delete('', DeleteMultipleStudentsAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));

        $group->group('/enrolls', function (Group $enrollGroup) {
            $enrollGroup->get('', ListEnrollmentAction::class);
            $enrollGroup->get('/idsactive', ListEnrollmentIdsActiveAction::class);
            // $enrollGroup->get('/query', GetEnrollmentsQueryAction::class);
            $enrollGroup->post('', CreateEnrollmentAction::class);
            $enrollGroup->put('/changegroup', UpdateGroupAction::class);
            $enrollGroup->put('/{id}', UpdateEnrollmentAction::class);
            
            // $enrollGroup->delete('/{id}', DeleteEnrollmentAction::class);
            // $enrollGroup->delete('', DeleteMultipleEnrollmentsAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));

        $group->group('/academic-periods', function (Group $academicPeriodGroup) {
            // Ruta para listar los períodos académicos
            $academicPeriodGroup->get('', ListAcademicPeriodsAction::class);
            // obtener el periodo academico actual
            $academicPeriodGroup->get('/current', GetSelectedAcademicPeriod::class);
            $academicPeriodGroup->put('/change-select', SelectAcademicPeriodAction::class);
            $academicPeriodGroup->post('', CreateAcademicPeriodAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));
        

        // gruop de settings
        $group->group('/settings', function (Group $settingsGroup) {
            $settingsGroup->put('', ChangeSettingAction::class);
        })->add($this->get(RoleMiddleware::class)->withRole('admin'));

        $group->group('/groupclass', function (Group $groupClassGroup) {
            $groupClassGroup->get('', ListGroupClassAction::class);
            $groupClassGroup->get('/availability-by-room', AvailabilityByRoomGroupClassAction::class);
            $groupClassGroup->post('', CreateGroupClassAction::class);

        })->add($this->get(RoleMiddleware::class)->withRole('admin'));
    });
};
