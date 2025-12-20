import { useParams } from "react-router-dom";
import { useState } from "react";
import StudentsList from "./StudentsList";

export default function AssignCourse() {
  const { courseId } = useParams();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const assign = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/courses/${courseId}/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ studentIds: selectedStudents }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("Course assigned successfully");
      setSelectedStudents([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Assign Students</h2>

      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <StudentsList
        selected={selectedStudents}
        setSelected={setSelectedStudents}
      />

      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={assign}
        disabled={selectedStudents.length === 0}
      >
        Assign Course
      </button>
    </div>
  );
}
