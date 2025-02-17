import { lazy } from "react";

export const Instruments = lazy(() => import("../pages/Instruments"));
export const Rooms = lazy(() => import("../pages/Rooms"));
export const Courses = lazy(() => import("../pages/Courses"));
export const Semesters = lazy(() => import("../pages/Semesters"));
export const Users = lazy(() => import("../pages/Users"));
export const GeneralSettings = lazy(() => import("../pages/GeneralSettings"));
