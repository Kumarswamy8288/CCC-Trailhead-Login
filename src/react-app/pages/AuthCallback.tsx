import { useAuth } from "@getmocha/users-service/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import Logo from "@/react-app/components/Logo";

export default function AuthCallback() {
  const { exchangeCodeForSessionToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        
        // Check if user needs to complete profile
        const response = await fetch("/api/users/me", { credentials: "include" });
        const userData = await response.json();
        
        if (!userData.college_name) {
          navigate("/profile/complete");
        } else {
          navigate("/student");
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        navigate("/");
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center" style={{ backgroundImage: 'url(https://mocha-cdn.com/01999959-a254-7583-a838-10ceca9839e9/salesforce-bg-2.jpg)' }}>
      <div className="absolute inset-0 bg-white/85"></div>
      <div className="text-center relative z-10">
        <Logo size="md" className="justify-center mb-8" />
        <div className="flex items-center justify-center gap-3 text-blue-600">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-lg font-medium">Completing sign in...</span>
        </div>
      </div>
    </div>
  );
}
