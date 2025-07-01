
import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Flag } from "lucide-react";
import { NavLink } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-f1-black via-slate-900 to-f1-black flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-f1-red"></div>
      </div>
    );
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-f1-black via-slate-900 to-f1-black flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-f1-red/5 via-transparent to-f1-orange/5" />
        <div className="racing-track absolute top-1/3 left-0 w-full h-px" />
        
        <Card className="w-full max-w-md racing-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-racing-gradient rounded-full flex items-center justify-center shadow-2xl">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="racing-text text-2xl">Authentication Required</CardTitle>
            <CardDescription>
              You need to be signed in to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <NavLink to="/login">
              <Button className="w-full speed-button">
                🏁 Sign In
              </Button>
            </NavLink>
            <div className="text-center">
              <NavLink 
                to="/" 
                className="text-sm text-muted-foreground hover:text-f1-red transition-colors inline-flex items-center gap-2"
              >
                <Flag className="w-4 h-4" />
                Back to F1 Box Box
              </NavLink>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
