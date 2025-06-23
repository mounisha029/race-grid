import { Link, useLocation } from "react-router-dom";
import { Home, Users, Flag, CalendarDays } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();

  const navigationItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/drivers", icon: Users, label: "Drivers" },
    { href: "/teams", icon: Users, label: "Teams" },
    { href: "/races", icon: Flag, label: "Races" },
    { href: "/calendar", icon: CalendarDays, label: "Calendar" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 bg-card border-t z-50 md:hidden">
      <ul className="flex items-center justify-around p-2">
        {navigationItems.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className={`flex flex-col items-center justify-center px-2 py-1 rounded-md text-sm transition-colors hover:bg-secondary/50 ${
                location.pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNavigation;
