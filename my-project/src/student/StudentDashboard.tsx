import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Course = {
  id: string;
  title: string;
};

export default function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await fetch(
          "http://localhost:5000/api/users/my-courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const coursesData = await coursesRes.json();
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        const userRes = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = await userRes.json();
        if (user.role === "mentor") {
          navigate("/mentor");
          return;
        }
      } catch (err) {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const becomeMentor = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/request-mentor", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }
      alert("You are now a mentor! Redirecting...");
      navigate("/mentor");
    } catch (err) {
      console.error("Failed to become mentor");
      alert("Failed to switch to mentor mode");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Courses</h1>
      <div className="border p-4 rounded bg-gray-50">
        <h2 className="font-semibold mb-2">Want to become a mentor?</h2>
        <p className="text-sm text-gray-600 mb-3">
          Switch to mentor mode to create and assign courses to students.
        </p>
        <button
          onClick={becomeMentor}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Switch to Mentor Mode
        </button>
      </div>

      {courses.length === 0 ? (
        <p>No courses assigned yet.</p>
      ) : (
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
      )}
    </div>
  );
}