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

        const data = await res.json();
        setChapters(data);
      } catch (err) {
        console.error("Failed to load chapters");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [courseId]);

  const completeChapter = async (chapterId: string) => {
    await fetch(
      `http://localhost:5000/api/progress/${chapterId}/complete`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setChapters((prev) =>
      prev.map((c) =>
        c.id === chapterId ? { ...c, completed: true } : c
      )
    );
  };

  const downloadCertificate = async () => {
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
  };

  const allCompleted =
    chapters.length > 0 &&
    chapters.every((c) => c.completed);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Chapters</h2>

      <ul className="space-y-3">
        {chapters.map((ch) => (
          <li
            key={ch.id}
            className="border p-4 rounded flex justify-between"
          >
            <span>{ch.title}</span>

            {ch.completed ? (
              <span className="text-green-600">Completed</span>
            ) : (
              <button
                onClick={() => completeChapter(ch.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Complete
              </button>
            )}
          </li>
        ))}
      </ul>

      {allCompleted && (
        <div className="mt-6">
          <button
            onClick={downloadCertificate}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Download Certificate
          </button>
        </div>
      )}
    </div>
  );
}
