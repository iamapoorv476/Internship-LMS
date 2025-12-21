import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Chapter = {
  id: string;
  title: string;
  completed: boolean;
};

export default function StudentCourse() {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/course/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to load chapters");
        }

        const data = await res.json();
        console.log("Chapters loaded:", data); 
        setChapters(data);
      } catch (err: any) {
        console.error("Failed to load chapters:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [courseId, token]);

  const completeChapter = async (chapterId: string) => {
    try {
      console.log("Completing chapter:", chapterId); 
      
      const res = await fetch(
        `http://localhost:5000/api/progress/${chapterId}/complete`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to complete chapter");
      }

      console.log("Chapter completed successfully"); 

      
      setChapters((prev) =>
        prev.map((c) =>
          c.id === chapterId ? { ...c, completed: true } : c
        )
      );
    } catch (err: any) {
      console.error("Error completing chapter:", err);
      alert(err.message);
    }
  };

  const downloadCertificate = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/certificates/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "certificate.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Error downloading certificate:", err);
      alert("Failed to download certificate");
    }
  };

  const allCompleted =
    chapters.length > 0 && chapters.every((c) => c.completed);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Chapters</h2>

      {chapters.length === 0 && (
        <p>No chapters available for this course yet.</p>
      )}

      <ul className="space-y-3">
        {chapters.map((ch) => (
          <li
            key={ch.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <span>{ch.title}</span>

            {ch.completed ? (
              <span className="text-green-600 font-semibold">✓ Completed</span>
            ) : (
              <button
                onClick={() => completeChapter(ch.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Mark Complete
              </button>
            )}
          </li>
        ))}
      </ul>

      {allCompleted && (
        <div className="mt-6">
          <button
            onClick={downloadCertificate}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Download Certificate
          </button>
        </div>
      )}
    </div>
  );
}