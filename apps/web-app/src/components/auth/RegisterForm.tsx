import { useState } from "react";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc";
import { AppProviders } from "@/components/layout/AppProviders";

export function RegisterForm() {
  return <AppProviders><RegisterFormInner /></AppProviders>;
}

function RegisterFormInner() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      window.location.href = "/";
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate({
      email,
      password,
      name: name || undefined,
    });
  };

  return (
    <div className="w-full space-y-8">
      {/* Branding */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Muslimfy</h1>
        <p className="text-sm text-muted-foreground">
          Create your account to start your journey.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm text-muted-foreground">
            Full Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-card border-border rounded-xl h-12"
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-card border-border rounded-xl h-12"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-muted-foreground">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-card border-border rounded-xl h-12 pr-12"
              placeholder="Min. 8 characters"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-card border-border rounded-xl h-12 pr-12"
              placeholder="Re-enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full h-12 rounded-xl text-base font-semibold"
        >
          {registerMutation.isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="text-primary font-medium hover:underline">
          Sign In
        </a>
      </p>
    </div>
  );
}
