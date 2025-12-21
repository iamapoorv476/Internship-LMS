import { Outlet, Link } from "react-router-dom";

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex gap-6">
        <Link to="/student" className="font-semibold">My Courses</Link>
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}