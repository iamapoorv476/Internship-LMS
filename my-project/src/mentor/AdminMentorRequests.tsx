import { useEffect, useState } from "react";

export default function AdminMentorRequests() {
  const [users, setUsers] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/mentor-requests", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const approve = async (id: string) => {
    await fetch(
      `http://localhost:5000/api/admin/approve-mentor/${id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div>
      <h2>Mentor Requests</h2>
      {users.map(u => (
        <div key={u.id}>
          {u.email}
          <button onClick={() => approve(u.id)}>Approve</button>
        </div>
      ))}
    </div>
  );
}
