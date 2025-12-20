import { useParams } from "react-router-dom";
import { useState } from "react";

export default function AddChapter() {
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/courses/${courseId}/chapters`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("Chapter added successfully");
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Chapter</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Chapter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border p-2 mb-3 rounded"
          placeholder="Chapter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Add Chapter
        </button>
      </form>
    </div>
  );
}
