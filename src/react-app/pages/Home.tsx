import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to landing page
    navigate("/");
  }, [navigate]);

  return null;
}
