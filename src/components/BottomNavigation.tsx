
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Flag, CalendarDays, BarChart3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const BottomNavigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navigationItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/drivers", icon: Users, label: "Drivers" },
    { href: "/races", icon: Flag, label: "Races" },
    { href: "/calendar", icon: CalendarDays, label: "Calendar" },
    { href: "/analytics", icon: BarChart3, label: "Stats" },
  ];

  if (!isMobile) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 bg-card/95 backdrop-blur-sm border-t z-50 safe-area-bottom">
      <ul className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => (
          <li key={item.href} className="flex-1">
            <Link
              to={item.href}
              className={`
                flex flex-col items-center justify-center px-2 py-2 rounded-lg text-xs transition-all duration-200
                min-h-[48px] touch-manipulation
                ${location.pathname === item.href 
                  ? "text-f1-red bg-f1-red/10 scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }
              `}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="truncate">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNavigation;
