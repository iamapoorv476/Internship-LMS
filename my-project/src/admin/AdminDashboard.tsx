import { useEffect, useState } from "react";

type MentorRequest = {
  id: string;
  email: string;
};

export default function AdminDashboard() {
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/users/mentor-requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setRequests(data || []);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (userId: string, email: string) => {
    if (!confirm(`Approve ${email} as mentor?`)) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/approve-mentor/${userId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        alert(`Failed: ${error.message}`);
        return;
      }

      alert("Mentor approved successfully!");
      fetchRequests(); 
    } catch (err) {
      console.error("Error approving mentor:", err);
      alert("Failed to approve mentor");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Pending Mentor Requests</h2>
          </div>

          {requests.length === 0 ? (
            <p className="p-6 text-gray-600">No pending requests</p>
          ) : (
            <ul className="divide-y">
              {requests.map((req) => (
                <li
                  key={req.id}
                  className="p-4 flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{req.email}</p>
                    <p className="text-sm text-gray-500">ID: {req.id}</p>
                  </div>
                  <button
                    onClick={() => approve(req.id, req.email)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}