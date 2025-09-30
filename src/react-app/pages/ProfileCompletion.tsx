import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { School, CheckCircle } from "lucide-react";
import Logo from "@/react-app/components/Logo";

export default function ProfileCompletion() {
  const [collegeName, setCollegeName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ college_name: collegeName }),
      });

      if (response.ok) {
        navigate("/student");
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = user?.google_user_data.name || user?.google_user_data.given_name || "Student";

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center p-6" style={{ backgroundImage: 'url(https://mocha-cdn.com/01999959-a254-7583-a838-10ceca9839e9/salesforce-bg-1.jpg)' }}>
      <div className="absolute inset-0 bg-white/85"></div>
      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo size="md" className="justify-center mb-6" />
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="text-green-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Welcome, {displayName}!</h2>
          </div>
          <p className="text-gray-600">
            Let's complete your profile to get started with Campus Corporate Connect
          </p>
        </div>

        {/* Profile Completion Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <School className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Complete Your Profile
            </h3>
            <p className="text-gray-600 text-sm">
              Please tell us which college you're attending
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700 mb-2">
                College/University Name *
              </label>
              <input
                id="collegeName"
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., University of California, Berkeley"
              />
              <p className="text-xs text-gray-500 mt-1">
                This helps us customize your learning experience
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !collegeName.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Completing Profile...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Complete Profile
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Access your personalized student dashboard</li>
                <li>• Connect directly to Salesforce Trailhead</li>
                <li>• Track your learning progress</li>
                <li>• Explore curated learning paths</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
