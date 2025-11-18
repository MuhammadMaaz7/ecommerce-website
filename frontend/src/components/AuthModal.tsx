import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export const AuthModal = ({ isOpen, onClose, initialMode = "login" }: AuthModalProps) => {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
    { label: "At least 6 characters", met: false },
    { label: "Contains a number", met: false },
    { label: "Contains a letter", met: false },
  ]);

  // Validate password requirements in real-time
  useEffect(() => {
    if (mode === "signup") {
      const password = formData.password;
      setPasswordRequirements([
        { label: "At least 6 characters", met: password.length >= 6 },
        { label: "Contains a number", met: /\d/.test(password) },
        { label: "Contains a letter", met: /[a-zA-Z]/.test(password) },
      ]);
    }
  }, [formData.password, mode]);

  const isPasswordValid = () => {
    return passwordRequirements.every((req) => req.met);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password for signup
    if (mode === "signup" && !isPasswordValid()) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: "Please meet all password requirements",
      });
      return;
    }

    setIsLoading(true);

    try {
      let userData;
      if (mode === "login") {
        userData = await login(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
      } else {
        userData = await register(formData.name, formData.email, formData.password);
        toast({
          title: "Account created!",
          description: "You're now logged in and ready to shop.",
        });
      }
      onClose();
      setFormData({ email: "", password: "", name: "" });
      
      // Redirect admin users to admin panel
      if (userData?.role === "admin") {
        window.location.href = "/admin";
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: err.message || "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = (newMode: "login" | "signup") => {
    setMode(newMode);
    setFormData({ email: "", password: "", name: "" });
    setShowPassword(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-lg shadow-xl z-50 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements for Signup */}
              {mode === "signup" && formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2 bg-secondary/50 p-3 rounded-md"
                >
                  <p className="text-sm font-medium text-muted-foreground">
                    Password Requirements:
                  </p>
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {req.met ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={req.met ? "text-green-600" : "text-muted-foreground"}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-light text-white"
                disabled={isLoading || (mode === "signup" && !isPasswordValid())}
              >
                {isLoading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("signup")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("login")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
