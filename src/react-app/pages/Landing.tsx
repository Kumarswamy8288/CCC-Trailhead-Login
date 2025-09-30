import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Users, ExternalLink, Shield } from "lucide-react";
import Logo from "@/react-app/components/Logo";

export default function Landing() {
  const { user, redirectToLogin, isPending } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isPending) {
      navigate("/student");
    }
  }, [user, isPending, navigate]);

  const handleGoogleSignIn = async () => {
    await redirectToLogin();
  };

  const handleAdminLogin = () => {
    navigate("/admin/login");
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-pulse">
          <Logo size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(https://mocha-cdn.com/01999959-a254-7583-a838-10ceca9839e9/salesforce-bg-2.jpg)' }}>
      <div className="absolute inset-0 bg-white/80"></div>
      <div className="relative z-10">
      {/* Hero Section */}
        <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <Logo size="lg" className="justify-center mb-8" />
          <h2 className="text-2xl text-gray-700 mb-4 font-medium">
            Your Gateway to Salesforce Excellence
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access curated learning paths, track your progress, and advance your career with Salesforce Trailhead through our integrated student portal.
          </p>
        </div>

        {/* Main Action Buttons */}
        <div className="max-w-md mx-auto space-y-6">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <button
            onClick={handleAdminLogin}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <Shield size={24} />
            Admin Login
          </button>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Direct Trailhead Access</h3>
            <p className="text-gray-600">Seamless integration with Salesforce Trailhead for immediate learning access.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Student Management</h3>
            <p className="text-gray-600">Comprehensive admin dashboard for managing student progress and records.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Access</h3>
            <p className="text-gray-600">Google OAuth authentication ensures secure and easy access for all students.</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
