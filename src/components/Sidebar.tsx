
import { NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  Trophy,
  Users,
  Flag,
  Settings,
  BarChart3,
  Radio
} from "lucide-react";
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const navigation = [
  { name: "Home", href: "/", icon: Flag },
  { name: "Drivers", href: "/drivers", icon: Users },
  { name: "Teams", href: "/teams", icon: Trophy },
  { name: "Races", href: "/races", icon: Calendar },
];

const adminNavigation = [
  { name: "Admin Panel", href: "/admin", icon: Settings },
  { name: "Live Timing", href: "/live", icon: Radio },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <SidebarUI className="hidden md:flex border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <NavLink to={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <NavLink to={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarUI>
  );
};

export default Sidebar;
