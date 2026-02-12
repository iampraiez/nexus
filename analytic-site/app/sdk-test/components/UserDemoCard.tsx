"use client";

import { useState } from "react";
import { useNexus } from "../NexusProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, LogIn, UserPlus } from "lucide-react";

interface UserDemoCardProps {
  onEventTracked: () => void;
}

export default function UserDemoCard({ onEventTracked }: UserDemoCardProps) {
  const { track } = useNexus();
  const [email, setEmail] = useState("demo@example.com");
  const [source, setSource] = useState("landing-page");

  const handleSignup = () => {
    track("user_signup", {
      email,
      source,
    });
    onEventTracked();
  };

  const handleLogin = () => {
    track("user_login", {
      email,
    });
    onEventTracked();
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          User Events
        </CardTitle>
        <CardDescription>
          Track user registration and authentication events.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="bg-background/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="source" className="text-muted-foreground">Signup Source</Label>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger id="source" className="bg-background/50">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="landing-page">Landing Page</SelectItem>
              <SelectItem value="google-ads">Google Ads</SelectItem>
              <SelectItem value="organic-search">Organic Search</SelectItem>
              <SelectItem value="social-media">Social Media</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sample Request Body</Label>
          <pre className="mt-1 p-3 rounded-lg bg-black/40 text-[10px] font-mono text-primary border border-primary/10 overflow-x-auto">
            {JSON.stringify({
              type: "user_signup",
              email,
              source
            }, null, 2)}
          </pre>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          onClick={handleSignup}
          className="hover:bg-primary/10 hover:text-primary border-primary/20"
        >
          <UserPlus className="mr-2 h-4 w-4 text-emerald-500" />
          Track Signup
        </Button>
        <Button 
          onClick={handleLogin}
          className="bg-primary hover:bg-primary/90"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Track Login
        </Button>
      </CardFooter>
    </Card>
  );
}
