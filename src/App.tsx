
import Index from "@/pages/Index";
import Drivers from "@/pages/Drivers";
import Teams from "@/pages/Teams";
import Races from "@/pages/Races";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import Calendar from "@/pages/Calendar";
import DriverProfile from "@/pages/DriverProfile";
import TeamProfile from "@/pages/TeamProfile";
import Analytics from "@/pages/Analytics";
import Social from "@/pages/Social";
import Profile from "@/pages/Profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="f1-box-theme">
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected routes with layout */}
                <Route path="/" element={
                  <Layout>
                    <Index />
                  </Layout>
                } />
                <Route path="/drivers" element={
                  <Layout>
                    <Drivers />
                  </Layout>
                } />
                <Route path="/drivers/:id" element={
                  <Layout>
                    <DriverProfile />
                  </Layout>
                } />
                <Route path="/teams" element={
                  <Layout>
                    <Teams />
                  </Layout>
                } />
                <Route path="/teams/:id" element={
                  <Layout>
                    <TeamProfile />
                  </Layout>
                } />
                <Route path="/races" element={
                  <Layout>
                    <Races />
                  </Layout>
                } />
                <Route path="/calendar" element={
                  <Layout>
                    <Calendar />
                  </Layout>
                } />
                <Route path="/analytics" element={
                  <Layout>
                    <Analytics />
                  </Layout>
                } />
                <Route path="/social" element={
                  <Layout>
                    <Social />
                  </Layout>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Layout>
                      <Admin />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
