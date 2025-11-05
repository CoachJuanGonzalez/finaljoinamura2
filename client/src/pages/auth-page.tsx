import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
      } else {
        await signup(formData.email, formData.password, formData.displayName);
        toast({
          title: "Account created!",
          description: "Welcome to AMURA. Let's set up your profile.",
        });
      }
      setLocation("/app/profile");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-6">
            <h1 className="text-4xl font-bold tracking-wide">AMURA</h1>
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">Keep the flow alive</h2>
          <p className="text-muted-foreground">
            {isLogin ? "Welcome back to your flow" : "Begin your journey"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? "Log In" : "Sign Up"}</CardTitle>
            <CardDescription>
              {isLogin 
                ? "Enter your credentials to continue" 
                : "Create your account to join circles"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your Name"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    required={!isLogin}
                    data-testid="input-display-name"
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
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  data-testid="input-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={isLoading}
                data-testid="button-submit"
              >
                {isLoading ? "Processing..." : (isLogin ? "Log In" : "Sign Up")}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
                data-testid="button-toggle-mode"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Log in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
