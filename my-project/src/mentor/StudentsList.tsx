import { useEffect, useState } from "react";

type Student = {
  id: string;
  email: string;
};

export default function StudentsList({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: (ids: string[]) => void;
}) {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudents(data);
    };

    fetchStudents();
  }, []);

  const toggle = (id: string) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  };

  return (
    <div className="space-y-2">
      {students.map((s) => (
        <label key={s.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected.includes(s.id)}
            onChange={() => toggle(s.id)}
          />
          {s.email}
        </label>
      ))}
    </div>
  );
}
