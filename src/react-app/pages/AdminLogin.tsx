import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, AlertCircle, Eye, EyeOff } from "lucide-react";
import Logo from "@/react-app/components/Logo";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        await response.json();
        navigate("/admin");
      } else {
        const data = await response.json();
        setError(data.error || "Invalid Admin Credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center p-6" style={{ backgroundImage: 'url(https://mocha-cdn.com/01999959-a254-7583-a838-10ceca9839e9/salesforce-bg-3.jpg)' }}>
      <div className="absolute inset-0 bg-white/85"></div>
      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={goBack}
            className="text-gray-600 hover:text-gray-800 mb-6 inline-flex items-center gap-2 transition-colors"
          >
            ← Back to Home
          </button>
          <Logo size="md" className="justify-center mb-6" />
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="text-purple-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
          </div>
          <p className="text-gray-600">Secure access for administrators only</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="admin@campuscorporateconnect.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-12"
                  placeholder="Enter your admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Sign In as Admin
                </>
              )}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
}
