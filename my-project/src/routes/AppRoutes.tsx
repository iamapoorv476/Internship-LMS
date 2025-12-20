import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";

import RequireAuth from "../auth/RequireAuth";


import MentorLayout from "../mentor/MentorLayout";
import MentorDashboard from "../mentor/MentorDashboard";
import MyCourses from "../mentor/MyCourses";
import CreateCourse from "../mentor/CreateCourse";
import AddChapter from "../mentor/AddChapter";
import AssignCourse from "../mentor/AssignCourse";


import StudentDashboard from "../student/StudentDashboard";
import StudentCourse from "../student/StudentCourse";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/mentor"
        element={
          <RequireAuth role="mentor">
            <MentorLayout />
          </RequireAuth>
        }
      >
        <Route index element={<MentorDashboard />} />
        <Route path="courses" element={<MyCourses />} />
        <Route path="create-course" element={<CreateCourse />} />
        <Route path="course/:courseId/chapters" element={<AddChapter />} />
        <Route path="course/:courseId/assign" element={<AssignCourse />} />
      </Route>
      <Route
        path="/student"
        element={
          <RequireAuth role="student">
            <StudentDashboard />
          </RequireAuth>
        }
      >
        <Route path="course/:courseId" element={<StudentCourse />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
