
import { useEffect } from "react";
import { Flag } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import EnhancedRegisterForm from "@/components/auth/EnhancedRegisterForm";

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-f1-black via-slate-900 to-f1-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-f1-red/5 via-transparent to-f1-orange/5" />
      <div className="racing-track absolute top-1/3 left-0 w-full h-px" />
      
      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <NavLink to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-racing-gradient rounded-full flex items-center justify-center shadow-2xl">
              <Flag className="w-6 h-6 text-white" />
            </div>
            <span className="racing-text text-2xl bg-gradient-to-r from-f1-red to-f1-orange bg-clip-text text-transparent">
              F1 Box Box
            </span>
          </NavLink>
        </div>

        <EnhancedRegisterForm onSuccess={() => navigate('/login')} />
        
        <div className="text-center mt-6 space-y-2">
          <NavLink 
            to="/login" 
            className="text-sm text-muted-foreground hover:text-f1-red transition-colors"
          >
            Already have an account? Sign in
          </NavLink>
          <br />
          <NavLink 
            to="/" 
            className="text-sm text-muted-foreground hover:text-f1-red transition-colors"
          >
            ← Back to F1 Box Box
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Register;
