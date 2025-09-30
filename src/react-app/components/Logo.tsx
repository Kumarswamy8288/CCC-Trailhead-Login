import { GraduationCap } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl"
  };

  const iconSizes = {
    sm: 32,
    md: 48,
    lg: 72
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        {/* Company Logo */}
        <img 
          src="https://mocha-cdn.com/01999959-a254-7583-a838-10ceca9839e9/Screenshot-2025-05-22-102120.png" 
          alt="CCC Logo" 
          className={`rounded-full object-cover ${size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-16 h-16' : 'w-20 h-20'}`}
        />
      </div>
      <div className="flex flex-col">
        <h1 className={`font-bold ${sizeClasses[size]}`}>
          <span className="text-orange-500">Campus</span>{" "}
          <span className="text-green-400">Corporate</span>{" "}
          <span className="text-blue-800">Connect</span>
        </h1>
        <p className="text-gray-600 text-sm font-medium">Student Portal</p>
      </div>
    </div>
  );
}
