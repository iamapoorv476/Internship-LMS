import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Course = {
  id: string;
  title: string;
};

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/courses/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setCourses(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Courses</h2>

      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-2">
        {courses.map((course) => (
          <li
            key={course.id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <span>{course.title}</span>
            <Link
              to={`/mentor/course/${course.id}/chapters`}
              className="text-blue-600 underline"
            >
              Manage Chapters
            </Link>
            <Link
              to={`/mentor/course/${course.id}/assign`}
              className="text-green-600 underline"
            >
               Assign Students
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
