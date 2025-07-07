
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider"
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/toaster"
import Layout from "@/components/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LazyLoadWrapper from "@/components/LazyLoadWrapper";
import { performanceMonitor, optimizeImages } from "@/utils/performanceMonitor";
import { usePrefetchCriticalData } from "@/hooks/usePrefetchCriticalData";
import { lazy, useEffect } from "react";

// Lazy load route components
const LazyIndex = lazy(() => import("@/pages/Index"));
const LazyDrivers = lazy(() => import("@/pages/Drivers"));
const LazyTeams = lazy(() => import("@/pages/Teams"));
const LazyRaces = lazy(() => import("@/pages/Races"));
const LazyCalendar = lazy(() => import("@/pages/Calendar"));
const LazyAnalytics = lazy(() => import("@/pages/Analytics"));
const LazyDriverProfile = lazy(() => import("@/pages/DriverProfile"));
const LazyTeamProfile = lazy(() => import("@/pages/TeamProfile"));
const LazyProfile = lazy(() => import("@/pages/Profile"));
const LazySocial = lazy(() => import("@/pages/Social"));
const LazyLogin = lazy(() => import("@/pages/Login"));
const LazyRegister = lazy(() => import("@/pages/Register"));
const LazyAdmin = lazy(() => import("@/pages/Admin"));
const LazyErgastDemo = lazy(() => import("@/pages/ErgastDemo"));
const LazyNotFound = lazy(() => import("@/pages/NotFound"));

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  const { prefetchData } = usePrefetchCriticalData();

  useEffect(() => {
    // Initialize performance monitoring
    const reportMetrics = () => {
      setTimeout(() => {
        const metrics = performanceMonitor.reportMetrics();
        const resourceTiming = performanceMonitor.getResourceTiming();
        
        console.log('App Performance Metrics:', metrics);
        console.log('Resource Timing:', resourceTiming);
        
        // Send metrics to service worker for potential analytics
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'PERFORMANCE_METRICS',
            metrics,
            resourceTiming
          });
        }
      }, 3000);
    };

    // Preload critical images
    optimizeImages.preloadImages([
      '/placeholder.svg',
      // Add other critical images here
    ]);

    // Prefetch critical data
    prefetchData();

    // Report metrics after initial load
    if (document.readyState === 'complete') {
      reportMetrics();
    } else {
      window.addEventListener('load', reportMetrics);
    }

    return () => {
      performanceMonitor.disconnect();
      window.removeEventListener('load', reportMetrics);
    };
  }, [prefetchData]);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <Toaster />
            <Layout>
              <Routes>
                <Route path="/" element={
                  <LazyLoadWrapper>
                    <LazyIndex />
                  </LazyLoadWrapper>
                } />
                <Route path="/drivers" element={
                  <LazyLoadWrapper>
                    <LazyDrivers />
                  </LazyLoadWrapper>
                } />
                <Route path="/drivers/:id" element={
                  <LazyLoadWrapper>
                    <LazyDriverProfile />
                  </LazyLoadWrapper>
                } />
                <Route path="/teams" element={
                  <LazyLoadWrapper>
                    <LazyTeams />
                  </LazyLoadWrapper>
                } />
                <Route path="/teams/:id" element={
                  <LazyLoadWrapper>
                    <LazyTeamProfile />
                  </LazyLoadWrapper>
                } />
                <Route path="/races" element={
                  <LazyLoadWrapper>
                    <LazyRaces />
                  </LazyLoadWrapper>
                } />
                <Route path="/calendar" element={
                  <LazyLoadWrapper>
                    <LazyCalendar />
                  </LazyLoadWrapper>
                } />
                <Route path="/analytics" element={
                  <LazyLoadWrapper>
                    <LazyAnalytics />
                  </LazyLoadWrapper>
                } />
                <Route path="/ergast-demo" element={
                  <LazyLoadWrapper>
                    <LazyErgastDemo />
                  </LazyLoadWrapper>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <LazyLoadWrapper>
                      <LazyProfile />
                    </LazyLoadWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/social" element={
                  <LazyLoadWrapper>
                    <LazySocial />
                  </LazyLoadWrapper>
                } />
                <Route path="/login" element={
                  <LazyLoadWrapper>
                    <LazyLogin />
                  </LazyLoadWrapper>
                } />
                <Route path="/register" element={
                  <LazyLoadWrapper>
                    <LazyRegister />
                  </LazyLoadWrapper>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <LazyLoadWrapper>
                      <LazyAdmin />
                    </LazyLoadWrapper>
                  </ProtectedRoute>
                } />
                <Route path="*" element={
                  <LazyLoadWrapper>
                    <LazyNotFound />
                  </LazyLoadWrapper>
                } />
              </Routes>
            </Layout>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
