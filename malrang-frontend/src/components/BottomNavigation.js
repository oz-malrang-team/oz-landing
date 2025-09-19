import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, User, Building2 } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "홈" },
    { path: "/community", icon: MessageCircle, label: "커뮤니티" },
    { path: "/company", icon: Building2, label: "회사소개" },
    { path: "/mypage", icon: User, label: "마이" }
  ];

  return (
    <div className="bg-white border-t border-gray-200 z-50 relative">
      <div className="flex justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === "/" && location.pathname === "/roulette");
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 ${
                isActive ? "text-pink-500" : "text-gray-500"
              }`}
            >
              <Icon size={20} className={isActive ? "text-pink-500" : "text-gray-500"} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
