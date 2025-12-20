import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import MentorDashboard from "../mentor/MentorDashboard";
import StudentDashboard from "../student/StudentDashboard";
import RequireAuth from "../auth/RequireAuth";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/mentor"
        element={
          <RequireAuth role="mentor">
            <MentorDashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/student"
        element={
          <RequireAuth role="student">
            <StudentDashboard />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
