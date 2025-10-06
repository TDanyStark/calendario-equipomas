-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 06-10-2025 a las 18:56:48
-- Versión del servidor: 11.8.3-MariaDB-log
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `u859885046_agenda_mas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `academic_periods`
--

CREATE TABLE `academic_periods` (
  `id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `semester` tinyint(4) NOT NULL CHECK (`semester` in (1,2)),
  `selected` tinyint(1) NOT NULL DEFAULT 0,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Disparadores `academic_periods`
--
DELIMITER $$
CREATE TRIGGER `before_insert_academic_periods` BEFORE INSERT ON `academic_periods` FOR EACH ROW BEGIN
    -- Verificar si ya hay un registro con selected = 1
    IF NEW.selected = 1 THEN
        IF (SELECT COUNT(*) FROM `academic_periods` WHERE selected = 1) > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Solo un registro puede tener selected = 1';
        END IF;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_update_academic_periods` BEFORE UPDATE ON `academic_periods` FOR EACH ROW BEGIN
    -- Verificar si ya hay un registro con selected = 1
    IF NEW.selected = 1 THEN
        IF (SELECT COUNT(*) FROM `academic_periods` WHERE selected = 1 AND id != NEW.id) > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Solo un registro puede tener selected = 1';
        END IF;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admins`
--

CREATE TABLE `admins` (
  `AdminID` varchar(20) NOT NULL,
  `AdminFirstName` varchar(50) NOT NULL,
  `AdminLastName` varchar(50) NOT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `courses`
--

CREATE TABLE `courses` (
  `CourseID` int(11) NOT NULL,
  `CourseName` varchar(100) NOT NULL,
  `IsOnline` tinyint(1) NOT NULL DEFAULT 0,
  `CourseDuration` int(11) NOT NULL DEFAULT 30,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `course_availability`
--

CREATE TABLE `course_availability` (
  `CourseAvailabilityID` int(11) NOT NULL,
  `CourseID` int(11) NOT NULL,
  `DayID` int(11) NOT NULL,
  `StartTime` time DEFAULT NULL,
  `EndTime` time DEFAULT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `enrollments`
--

CREATE TABLE `enrollments` (
  `EnrollmentID` int(11) NOT NULL,
  `StudentID` varchar(20) NOT NULL,
  `CourseID` int(11) NOT NULL,
  `SemesterID` int(11) NOT NULL,
  `InstrumentID` int(11) NOT NULL,
  `academic_periodID` int(11) NOT NULL,
  `Status` varchar(20) NOT NULL DEFAULT 'activo',
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `group_classes`
--

CREATE TABLE `group_classes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `room_id` int(11) NOT NULL,
  `academic_period_id` int(11) NOT NULL,
  `day_id` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `group_class_enrollments`
--

CREATE TABLE `group_class_enrollments` (
  `group_class_id` int(11) NOT NULL,
  `enrollment_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `group_class_professors`
--

CREATE TABLE `group_class_professors` (
  `group_class_id` int(11) NOT NULL,
  `professor_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instruments`
--

CREATE TABLE `instruments` (
  `InstrumentID` int(11) NOT NULL,
  `InstrumentName` varchar(50) NOT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `professors`
--

CREATE TABLE `professors` (
  `ProfessorID` varchar(20) NOT NULL,
  `ProfessorFirstName` varchar(50) NOT NULL,
  `ProfessorLastName` varchar(50) NOT NULL,
  `ProfessorPhone` varchar(15) DEFAULT NULL,
  `ProfessorStatus` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `ProfessorIsDelete` tinyint(1) NOT NULL DEFAULT 0,
  `Deleted_at` datetime DEFAULT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `professor_availability`
--

CREATE TABLE `professor_availability` (
  `AvailabilityID` int(11) NOT NULL,
  `ProfessorID` varchar(20) NOT NULL,
  `DayID` int(11) NOT NULL,
  `academic_period_id` int(11) NOT NULL,
  `StartTime` time NOT NULL,
  `EndTime` time NOT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `professor_contracts`
--

CREATE TABLE `professor_contracts` (
  `id` int(11) NOT NULL,
  `professor_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `academic_period_id` int(11) NOT NULL,
  `with_contract` tinyint(1) NOT NULL DEFAULT 1,
  `hours` int(11) NOT NULL,
  `date_assign` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `professor_instruments`
--

CREATE TABLE `professor_instruments` (
  `ProfessorInstrumentID` int(11) NOT NULL,
  `ProfessorID` varchar(20) NOT NULL,
  `InstrumentID` int(11) NOT NULL,
  `academic_period_id` int(11) NOT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `professor_rooms`
--

CREATE TABLE `professor_rooms` (
  `ProfessorRoomID` int(11) NOT NULL,
  `ProfessorID` varchar(20) NOT NULL,
  `RoomID` int(11) NOT NULL,
  `academic_period_id` int(11) NOT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `RoleID` int(11) NOT NULL,
  `RoleName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rooms`
--

CREATE TABLE `rooms` (
  `RoomID` int(11) NOT NULL,
  `RoomName` varchar(50) NOT NULL,
  `RoomCapacity` int(11) NOT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `schedule_days`
--

CREATE TABLE `schedule_days` (
  `DayID` int(11) NOT NULL,
  `DayName` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
  `DayDisplayName` enum('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `StartTime` time NOT NULL,
  `EndTime` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `semesters`
--

CREATE TABLE `semesters` (
  `SemesterID` int(11) NOT NULL,
  `SemesterName` varchar(50) NOT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `settings`
--

CREATE TABLE `settings` (
  `SettingID` int(11) NOT NULL,
  `SettingName` varchar(100) NOT NULL,
  `SettingValue` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `students`
--

CREATE TABLE `students` (
  `StudentID` varchar(20) NOT NULL,
  `StudentFirstName` varchar(50) NOT NULL,
  `StudentLastName` varchar(50) NOT NULL,
  `StudentPhone` varchar(15) DEFAULT NULL,
  `StudentStatus` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `UserID` varchar(20) NOT NULL,
  `UserEmail` varchar(100) NOT NULL,
  `UserPassword` varchar(255) NOT NULL,
  `RoleID` int(11) NOT NULL,
  `Created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `academic_periods`
--
ALTER TABLE `academic_periods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_year_semester` (`year`,`semester`);

--
-- Indices de la tabla `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`AdminID`);

--
-- Indices de la tabla `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`CourseID`);

--
-- Indices de la tabla `course_availability`
--
ALTER TABLE `course_availability`
  ADD PRIMARY KEY (`CourseAvailabilityID`),
  ADD KEY `CourseID` (`CourseID`),
  ADD KEY `fk_course_availability_day` (`DayID`);

--
-- Indices de la tabla `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`EnrollmentID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `CourseID` (`CourseID`),
  ADD KEY `SemesterID` (`SemesterID`),
  ADD KEY `InstrumentID` (`InstrumentID`),
  ADD KEY `fk_enrollments_academic_period` (`academic_periodID`);

--
-- Indices de la tabla `group_classes`
--
ALTER TABLE `group_classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `fk_group_classes_academic_period` (`academic_period_id`),
  ADD KEY `fk_group_classes_schedule_days` (`day_id`);

--
-- Indices de la tabla `group_class_enrollments`
--
ALTER TABLE `group_class_enrollments`
  ADD PRIMARY KEY (`group_class_id`,`enrollment_id`),
  ADD KEY `enrollment_id` (`enrollment_id`);

--
-- Indices de la tabla `group_class_professors`
--
ALTER TABLE `group_class_professors`
  ADD PRIMARY KEY (`group_class_id`,`professor_id`),
  ADD KEY `group_class_professors_ibfk_2` (`professor_id`);

--
-- Indices de la tabla `instruments`
--
ALTER TABLE `instruments`
  ADD PRIMARY KEY (`InstrumentID`);

--
-- Indices de la tabla `professors`
--
ALTER TABLE `professors`
  ADD PRIMARY KEY (`ProfessorID`);

--
-- Indices de la tabla `professor_availability`
--
ALTER TABLE `professor_availability`
  ADD PRIMARY KEY (`AvailabilityID`),
  ADD KEY `ProfessorID` (`ProfessorID`),
  ADD KEY `fk_dayid` (`DayID`),
  ADD KEY `fk_professor_availability_academic_periods` (`academic_period_id`);

--
-- Indices de la tabla `professor_contracts`
--
ALTER TABLE `professor_contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_professor` (`professor_id`),
  ADD KEY `fk_academic_period` (`academic_period_id`);

--
-- Indices de la tabla `professor_instruments`
--
ALTER TABLE `professor_instruments`
  ADD PRIMARY KEY (`ProfessorInstrumentID`),
  ADD KEY `ProfessorID` (`ProfessorID`),
  ADD KEY `InstrumentID` (`InstrumentID`),
  ADD KEY `fk_professor_instruments_academic_period` (`academic_period_id`);

--
-- Indices de la tabla `professor_rooms`
--
ALTER TABLE `professor_rooms`
  ADD PRIMARY KEY (`ProfessorRoomID`),
  ADD KEY `ProfessorID` (`ProfessorID`),
  ADD KEY `RoomID` (`RoomID`),
  ADD KEY `fk_professor_rooms_academic_period` (`academic_period_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`RoleID`);

--
-- Indices de la tabla `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`RoomID`);

--
-- Indices de la tabla `schedule_days`
--
ALTER TABLE `schedule_days`
  ADD PRIMARY KEY (`DayID`);

--
-- Indices de la tabla `semesters`
--
ALTER TABLE `semesters`
  ADD PRIMARY KEY (`SemesterID`);

--
-- Indices de la tabla `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`SettingID`);

--
-- Indices de la tabla `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`StudentID`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `UserEmail` (`UserEmail`),
  ADD KEY `users_ibfk_1` (`RoleID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `academic_periods`
--
ALTER TABLE `academic_periods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `courses`
--
ALTER TABLE `courses`
  MODIFY `CourseID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `course_availability`
--
ALTER TABLE `course_availability`
  MODIFY `CourseAvailabilityID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `EnrollmentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `group_classes`
--
ALTER TABLE `group_classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `instruments`
--
ALTER TABLE `instruments`
  MODIFY `InstrumentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `professor_availability`
--
ALTER TABLE `professor_availability`
  MODIFY `AvailabilityID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `professor_contracts`
--
ALTER TABLE `professor_contracts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `professor_instruments`
--
ALTER TABLE `professor_instruments`
  MODIFY `ProfessorInstrumentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `professor_rooms`
--
ALTER TABLE `professor_rooms`
  MODIFY `ProfessorRoomID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `RoleID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rooms`
--
ALTER TABLE `rooms`
  MODIFY `RoomID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `semesters`
--
ALTER TABLE `semesters`
  MODIFY `SemesterID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `settings`
--
ALTER TABLE `settings`
  MODIFY `SettingID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`AdminID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `course_availability`
--
ALTER TABLE `course_availability`
  ADD CONSTRAINT `course_availability_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_course_availability_day` FOREIGN KEY (`DayID`) REFERENCES `schedule_days` (`DayID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_3` FOREIGN KEY (`SemesterID`) REFERENCES `semesters` (`SemesterID`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_4` FOREIGN KEY (`InstrumentID`) REFERENCES `instruments` (`InstrumentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_enrollments_academic_period` FOREIGN KEY (`academic_periodID`) REFERENCES `academic_periods` (`id`);

--
-- Filtros para la tabla `group_classes`
--
ALTER TABLE `group_classes`
  ADD CONSTRAINT `fk_group_classes_academic_period` FOREIGN KEY (`academic_period_id`) REFERENCES `academic_periods` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_group_classes_schedule_days` FOREIGN KEY (`day_id`) REFERENCES `schedule_days` (`DayID`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_classes_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`RoomID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `group_class_enrollments`
--
ALTER TABLE `group_class_enrollments`
  ADD CONSTRAINT `group_class_enrollments_ibfk_1` FOREIGN KEY (`group_class_id`) REFERENCES `group_classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_class_enrollments_ibfk_2` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`EnrollmentID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `group_class_professors`
--
ALTER TABLE `group_class_professors`
  ADD CONSTRAINT `group_class_professors_ibfk_1` FOREIGN KEY (`group_class_id`) REFERENCES `group_classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_class_professors_ibfk_2` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`ProfessorID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `professors`
--
ALTER TABLE `professors`
  ADD CONSTRAINT `professors_ibfk_1` FOREIGN KEY (`ProfessorID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `professor_availability`
--
ALTER TABLE `professor_availability`
  ADD CONSTRAINT `fk_dayid` FOREIGN KEY (`DayID`) REFERENCES `schedule_days` (`DayID`) ON DELETE NO ACTION,
  ADD CONSTRAINT `fk_professor_availability_academic_periods` FOREIGN KEY (`academic_period_id`) REFERENCES `academic_periods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `professor_availability_ibfk_1` FOREIGN KEY (`ProfessorID`) REFERENCES `professors` (`ProfessorID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `professor_contracts`
--
ALTER TABLE `professor_contracts`
  ADD CONSTRAINT `fk_academic_period` FOREIGN KEY (`academic_period_id`) REFERENCES `academic_periods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_professor` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`ProfessorID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `professor_instruments`
--
ALTER TABLE `professor_instruments`
  ADD CONSTRAINT `fk_professor_instruments_academic_period` FOREIGN KEY (`academic_period_id`) REFERENCES `academic_periods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `professor_instruments_ibfk_1` FOREIGN KEY (`ProfessorID`) REFERENCES `professors` (`ProfessorID`) ON DELETE CASCADE,
  ADD CONSTRAINT `professor_instruments_ibfk_2` FOREIGN KEY (`InstrumentID`) REFERENCES `instruments` (`InstrumentID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `professor_rooms`
--
ALTER TABLE `professor_rooms`
  ADD CONSTRAINT `fk_professor_rooms_academic_period` FOREIGN KEY (`academic_period_id`) REFERENCES `academic_periods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `professor_rooms_ibfk_1` FOREIGN KEY (`ProfessorID`) REFERENCES `professors` (`ProfessorID`) ON DELETE CASCADE,
  ADD CONSTRAINT `professor_rooms_ibfk_2` FOREIGN KEY (`RoomID`) REFERENCES `rooms` (`RoomID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `roles` (`RoleID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
