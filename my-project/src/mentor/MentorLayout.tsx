import { Outlet,Link } from "react-router-dom";

export default function MentorLayout(){
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow p-4 flex gap-6">
                 <Link to="/mentor" className="font-semibold">Dashboard</Link>
                 <Link to="/mentor/create-course" className="font-semibold">
                     Create Course
                 </Link>
                 <Link to="/mentor/courses" className="font-semibold">
                    My Courses
                 </Link>

            </nav>

            
      <main className="p-6">
        <Outlet />
      </main>
        </div>
    )
}