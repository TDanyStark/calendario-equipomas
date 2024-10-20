// src/App.js
import "./App.css";
import { Routes, Route } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import { Roles } from "./data/Roles";


function App() {
  return (
    <Routes>

      {/* Rutas publicas */}
      <Route path="/login" element={<Login/>} />
      <Route path="/logout" element={<Logout />} />

      <Route path="/" element={<h1>Home</h1>} />


      {/* Rutas que usan DefaultLayout */}
      <Route path="/" element={
          <ProtectedRoute requiredRole={Roles.admin}>
            <DefaultLayout />
          </ProtectedRoute>
        }>
        <Route path="dashboard" element={<h1>Home</h1>} /> 
        <Route path="instruments" element={<h1>instruments</h1>} />
        <Route path="rooms" element={<h1>rooms</h1>} />
        <Route path="courses" element={<h1>courses</h1>} />
        <Route path="semesters" element={<h1>semesters</h1>} />
        <Route path="general-settings" element={<h1>general-settings</h1>} />
      </Route>

      <Route path="/" element={
          <ProtectedRoute requiredRole={Roles.student}>
            <DefaultLayout />
          </ProtectedRoute>
        }>
        <Route path="/student-schedule" element={<h1>Student Schedule</h1>} /> 
      </Route>

      <Route path="/" element={
          <ProtectedRoute requiredRole={Roles.professor}>
            <DefaultLayout />
          </ProtectedRoute>
        }>
        <Route path="/my-classes" element={<h1>My CLasses</h1>} /> 
      </Route>

      {/* Ruta comodín para manejar errores */}
      <Route
        path="*"
        element={<ErrorPage />}
      />
    </Routes>
  );
}

export default App;
