
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import BottomNavigation from "./BottomNavigation";
import SearchModal from "./SearchModal";
import PWAInstallBanner from "./mobile/PWAInstallBanner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        {isMobile && <PWAInstallBanner />}
        
        <Header onSearchClick={() => setIsSearchOpen(true)} />
        
        <div className="flex flex-1 w-full">
          {!isMobile && <Sidebar />}
          
          <main className={`
            flex-1 overflow-auto
            ${isMobile ? 'px-2 py-4 pb-20' : 'p-4 md:p-6'}
          `}>
            {children}
          </main>
        </div>

        {isMobile && <BottomNavigation />}
        
        <SearchModal 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
