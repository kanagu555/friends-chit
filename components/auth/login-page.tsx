"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginPage({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const mockUsers = {
    "admin@chitfund.com": {
      id: "1",
      name: "Admin User",
      email: "admin@chitfund.com",
      role: "admin",
      password: "admin123",
    },
    "member@chitfund.com": {
      id: "2",
      name: "John Doe",
      email: "member@chitfund.com",
      role: "member",
      password: "member123",
    },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = Object.values(mockUsers).find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      onLogin(user);
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Friends Chit</CardTitle>
          <CardDescription>
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg space-y-2 text-sm">
            <p className="font-semibold">Demo Credentials:</p>
            <p>Admin: admin@chitfund.com / admin123</p>
            <p>Member: member@chitfund.com / member123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
