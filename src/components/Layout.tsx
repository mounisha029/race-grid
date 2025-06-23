
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import BottomNavigation from "./BottomNavigation";
import SearchModal from "./SearchModal";
import { SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <Header onSearchClick={() => setIsSearchOpen(true)} />
        
        <div className="flex flex-1 w-full">
          <Sidebar />
          
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>

        <BottomNavigation />
        
        <SearchModal 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
