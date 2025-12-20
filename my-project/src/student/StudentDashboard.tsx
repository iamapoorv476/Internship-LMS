import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Course = {
  id: string;
  title: string;
};

export default function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/users/my-courses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setCourses(data);
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>

      {courses.length === 0 && <p>No courses assigned yet.</p>}

      <ul className="space-y-3">
        {courses.map((c) => (
          <li
            key={c.id}
            className="border p-4 rounded flex justify-between"
          >
            <span>{c.title}</span>
            <Link
              to={`/student/course/${c.id}`}
              className="text-blue-600 underline"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
