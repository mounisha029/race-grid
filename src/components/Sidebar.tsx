
import {
  Home,
  LayoutDashboard,
  Settings,
  Users,
  Flag,
  CalendarDays
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";

const Sidebar = () => {
  const location = useLocation();
  const { open, toggleSidebar } = useSidebar();

  const navigationItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/drivers", label: "Drivers", icon: Users },
    { href: "/teams", label: "Teams", icon: Users },
    { href: "/races", label: "Races", icon: Flag },
    { href: "/calendar", label: "Calendar", icon: CalendarDays },
  ];

  return (
    <aside
      className={`
        ${open ? 'w-64' : 'w-20'}
        flex flex-col bg-secondary border-r border-r-muted
        duration-300 transition-all
        h-screen sticky top-0
      `}
    >
      <div className="flex-1 flex flex-col gap-2 p-4">
        <NavLink to="/" className="font-bold text-lg flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          <span className={`${open ? 'block' : 'hidden'}`}>
            F1 Dashboard
          </span>
        </NavLink>

        <nav className="flex-1">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-md
                    hover:bg-muted
                    ${isActive ? 'bg-muted font-medium' : 'text-muted-foreground'}
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span className={`${open ? 'block' : 'hidden'}`}>
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-t-muted">
        <NavLink
          to="/admin"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-muted text-muted-foreground"
        >
          <Settings className="w-4 h-4" />
          <span className={`${open ? 'block' : 'hidden'}`}>
            Settings
          </span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
