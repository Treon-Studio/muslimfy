import { useState } from "react";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc";
import { AppProviders } from "@/components/layout/AppProviders";

export function LoginForm() {
  return <AppProviders><LoginFormInner /></AppProviders>;
}

function LoginFormInner() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      window.location.href = "/";
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
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
          Welcome back! Sign in to continue your journey.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
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

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full h-12 rounded-xl text-base font-semibold"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <a href="/register" className="text-primary font-medium hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}
