import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@getmocha/users-service/react";
import LandingPage from "@/react-app/pages/Landing";
import StudentDashboard from "@/react-app/pages/StudentDashboard";
import AdminLogin from "@/react-app/pages/AdminLogin";
import AdminDashboard from "@/react-app/pages/AdminDashboard";
import AuthCallback from "@/react-app/pages/AuthCallback";
import ProfileCompletion from "@/react-app/pages/ProfileCompletion";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <h1 style={{ textAlign: "center", marginTop: "30px" }}>
          Hello World — App.tsx Rendering OK
        </h1>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile/complete" element={<ProfileCompletion />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
