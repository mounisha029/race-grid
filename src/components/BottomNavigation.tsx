
import { NavLink } from "react-router-dom";
import { Calendar, Trophy, Users, Flag } from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Flag },
  { name: "Drivers", href: "/drivers", icon: Users },
  { name: "Teams", href: "/teams", icon: Trophy },
  { name: "Races", href: "/races", icon: Calendar },
];

const BottomNavigation = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t z-40">
      <div className="flex items-center justify-around py-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 min-w-0 flex-1 text-xs font-medium transition-colors ${
                isActive
                  ? "text-f1-red"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
