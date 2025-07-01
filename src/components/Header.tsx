
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  Search, 
  Bell, 
  Flag, 
  User,
  Settings,
  LogOut,
  UserPlus,
  LogIn
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderProps {
  onSearchClick: () => void;
}

const Header = ({ onSearchClick }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [notifications] = useState([
    { id: 1, message: "Lewis Hamilton wins Monaco GP!", time: "2h ago", unread: true },
    { id: 2, message: "Qualifying results are now available", time: "4h ago", unread: false },
  ]);

  const handleSignOut = async () => {
    await signOut();
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:mr-4 lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2 mr-6">
          <div className="w-8 h-8 bg-racing-gradient rounded-full flex items-center justify-center">
            <Flag className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:inline-block racing-text text-xl bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
            F1 Box Box
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium flex-1">
          <NavLink 
            to="/drivers" 
            className={({ isActive }) => 
              `transition-colors hover:text-foreground/80 ${isActive ? 'text-foreground' : 'text-foreground/60'}`
            }
          >
            Drivers
          </NavLink>
          <NavLink 
            to="/teams" 
            className={({ isActive }) => 
              `transition-colors hover:text-foreground/80 ${isActive ? 'text-foreground' : 'text-foreground/60'}`
            }
          >
            Teams
          </NavLink>
          <NavLink 
            to="/races" 
            className={({ isActive }) => 
              `transition-colors hover:text-foreground/80 ${isActive ? 'text-foreground' : 'text-foreground/60'}`
            }
          >
            Races
          </NavLink>
          <NavLink 
            to="/calendar" 
            className={({ isActive }) => 
              `transition-colors hover:text-foreground/80 ${isActive ? 'text-foreground' : 'text-foreground/60'}`
            }
          >
            Calendar
          </NavLink>
          <NavLink 
            to="/analytics" 
            className={({ isActive }) => 
              `transition-colors hover:text-foreground/80 ${isActive ? 'text-foreground' : 'text-foreground/60'}`
            }
          >
            Analytics
          </NavLink>
          <NavLink 
            to="/social" 
            className={({ isActive }) => 
              `transition-colors hover:text-foreground/80 ${isActive ? 'text-foreground' : 'text-foreground/60'}`
            }
          >
            Social
          </NavLink>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Search Button */}
          <Button variant="ghost" size="icon" onClick={onSearchClick}>
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {user ? (
            <>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-2">
                    <h4 className="text-sm font-semibold">Notifications</h4>
                    {unreadCount > 0 && (
                      <Badge variant="secondary">{unreadCount} new</Badge>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start space-y-1">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm">{notification.message}</span>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-f1-red rounded-full" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.email}</p>
                      <p className="text-muted-foreground text-xs">F1 Box Box Member</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavLink to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* Auth buttons for non-authenticated users */
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <NavLink to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </NavLink>
              </Button>
              <Button size="sm" asChild className="speed-button">
                <NavLink to="/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </NavLink>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Sheet Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <nav className="flex flex-col space-y-4 mt-8">
              <NavLink 
                to="/drivers"
                className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80"
              >
                Drivers
              </NavLink>
              <NavLink 
                to="/teams"
                className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80"
              >
                Teams
              </NavLink>
              <NavLink 
                to="/races"
                className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80"
              >
                Races
              </NavLink>
              <NavLink 
                to="/calendar"
                className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80"
              >
                Calendar
              </NavLink>
              <NavLink 
                to="/analytics"
                className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80"
              >
                Analytics
              </NavLink>
              <NavLink 
                to="/social"
                className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80"
              >
                Social
              </NavLink>
              
              {user && (
                <>
                  <div className="border-t pt-4">
                    <NavLink 
                      to="/profile"
                      className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </NavLink>
                  </div>
                  <Button variant="outline" onClick={handleSignOut} className="justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
