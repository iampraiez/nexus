"use client";

import { useState } from "react";
import { useNexus } from "../NexusProvider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, LogIn, UserPlus } from "lucide-react";

interface UserDemoCardProps {
  onEventTracked: (type: string) => void;
}

export default function UserDemoCard({ onEventTracked }: UserDemoCardProps) {
  const { track, isInitialized } = useNexus();
  const [email, setEmail] = useState("demo@example.com");
  const [source, setSource] = useState("landing-page");

  const handleSignup = () => {
    track("user_signup", { email, source });
    onEventTracked("user_signup");
  };

  const handleLogin = () => {
    track("user_login", { email });
    onEventTracked("user_login");
  };

  return (
    <Card className={`border-border/50 bg-card/50 backdrop-blur-sm flex flex-col transition-all ${!isInitialized ? "opacity-50 pointer-events-none" : "hover:border-primary/50"}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="w-4 h-4 text-primary" />
          User Events
        </CardTitle>
        <CardDescription className="text-xs">
          Track registration and authentication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-1">
        <div className="space-y-1.5">
          <Label htmlFor="ude-email" className="text-xs text-muted-foreground">Email</Label>
          <Input
            id="ude-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="bg-background/50 h-8 text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ude-source" className="text-xs text-muted-foreground">Signup Source</Label>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger id="ude-source" className="bg-background/50 h-8 text-xs">
              <SelectValue />
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

        <pre className="p-2.5 rounded-lg bg-black/40 text-[9px] font-mono text-primary/70 border border-primary/10 overflow-x-auto leading-relaxed">
          {JSON.stringify({ type: "user_signup", email, source }, null, 2)}
        </pre>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignup}
          className="text-xs hover:bg-primary/10 hover:text-primary border-primary/20"
        >
          <UserPlus className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
          Signup
        </Button>
        <Button size="sm" onClick={handleLogin} className="text-xs bg-primary hover:bg-primary/90">
          <LogIn className="mr-1.5 h-3.5 w-3.5" />
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
