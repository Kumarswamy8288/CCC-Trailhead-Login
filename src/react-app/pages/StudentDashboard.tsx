import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { ExternalLink, LogOut, User, Mail, School } from "lucide-react";
import Logo from "@/react-app/components/Logo";

export default function StudentDashboard() {
  const { user, logout, isPending } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    if (!isPending && !user) {
      navigate("/");
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    if (user) {
      // Fetch student data from our backend
      fetch("/api/users/me", {
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          // Check if college name is missing and redirect to profile completion
          if (!data.college_name) {
            navigate("/profile/complete");
            return;
          }
          setStudent(data);
        })
        .catch(console.error);
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const openTrailhead = () => {
    window.open("https://trailhead.salesforce.com", "_blank");
  };

  if (isPending || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Logo size="md" className="justify-center animate-pulse" />
      </div>
    );
  }

  const displayName = user.google_user_data.name || user.google_user_data.given_name || "Student";

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(https://mocha-cdn.com/01999959-a254-7583-a838-10ceca9839e9/salesforce-bg-1.jpg)' }}>
      <div className="absolute inset-0 bg-white/75"></div>
      <div className="relative z-10">
      {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Logo size="sm" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {displayName}!
            </h1>
            <p className="text-gray-600 text-lg">
              Ready to continue your Salesforce learning journey?
            </p>
          </div>

          {/* Student Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <div className="bg-blue-500 p-2 rounded-lg">
                <User className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-800">{displayName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
              <div className="bg-purple-500 p-2 rounded-lg">
                <Mail className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
              <div className="bg-green-500 p-2 rounded-lg">
                <School className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">College</p>
                <p className="font-semibold text-gray-800">
                  {student?.college_name || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Trailhead Access */}
          <div className="text-center">
            <button
              onClick={openTrailhead}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 mx-auto"
            >
              <ExternalLink size={24} />
              Go to Salesforce Trailhead
            </button>
            <p className="text-gray-600 mt-3">
              Access your personalized learning paths and start earning badges
            </p>
          </div>
        </div>

        {/* Learning Resources */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Featured Learning Paths</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">Admin Beginner</h4>
                <p className="text-sm text-blue-600">Learn the basics of Salesforce administration</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800">Developer Fundamentals</h4>
                <p className="text-sm text-purple-600">Start your journey as a Salesforce developer</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">Business User</h4>
                <p className="text-sm text-green-600">Maximize productivity with Salesforce tools</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <a
                href="https://trailhead.salesforce.com/en/content/learn/trails"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">Browse All Trails</span>
                  <ExternalLink size={16} className="text-gray-600" />
                </div>
              </a>
              <a
                href="https://trailhead.salesforce.com/en/content/learn/modules"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">Explore Modules</span>
                  <ExternalLink size={16} className="text-gray-600" />
                </div>
              </a>
              <a
                href="https://trailhead.salesforce.com/en/content/learn/projects"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">Hands-on Projects</span>
                  <ExternalLink size={16} className="text-gray-600" />
                </div>
              </a>
            </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
