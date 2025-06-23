
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Drivers from "./pages/Drivers";
import Teams from "./pages/Teams";
import Races from "./pages/Races";
import Calendar from "./pages/Calendar";
import LiveRace from "./pages/LiveRace";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DriverProfile from "./pages/DriverProfile";
import TeamProfile from "./pages/TeamProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/drivers/:driverId" element={<DriverProfile />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamProfile />} />
          <Route path="/races" element={<Races />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/live/:raceId" element={<LiveRace />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
