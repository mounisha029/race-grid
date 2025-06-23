
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { 
  Calendar, 
  Trophy, 
  Users, 
  Flag, 
  Search, 
  Menu, 
  Sun, 
  Moon, 
  UserCircle,
  Settings,
  LogOut,
  Radio
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import LiveRaceIndicator from "./LiveRaceIndicator";

interface HeaderProps {
  onSearchClick: () => void;
}

const Header = ({ onSearchClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: "Home", href: "/", icon: Flag },
    { name: "Drivers", href: "/drivers", icon: Users },
    { name: "Teams", href: "/teams", icon: Trophy },
    { name: "Races", href: "/races", icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section - Logo and Sidebar Toggle */}
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="md:hidden" />
            
            <NavLink to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-racing-gradient rounded-full flex items-center justify-center">
                <Flag className="w-4 h-4 text-white" />
              </div>
              <span className="racing-text text-xl bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
                F1 Box Box
              </span>
            </NavLink>

            <LiveRaceIndicator />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent ${
                    isActive
                      ? "bg-f1-red text-white shadow-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchClick}
              className="hidden md:flex w-9 h-9"
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 h-9">
                  <UserCircle className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <UserCircle className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-f1-red text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
              
              <Button
                variant="ghost"
                onClick={onSearchClick}
                className="flex items-center space-x-2 px-4 py-3 justify-start"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
