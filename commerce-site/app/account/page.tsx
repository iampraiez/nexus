"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { User, LogOut, Package, Heart, HelpCircle, Mail, MessageCircle } from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  console.log('Session', session)


  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi, I need help with my order");
    window.open(
      `https://wa.me/2349166072665?text=${message}`,
      "_blank"
    );
  };

  const handleEmail = () => {
    window.location.href = "mailto:himpraise571@gmail.com?subject=Support Request";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-accent/10 rounded-full">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Account</h1>
          </div>
          <Button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-2xl">
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Name
                </p>
                <p className="font-semibold text-sm">
                  {session.user.name || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Email
                </p>
                <p className="font-semibold text-sm break-all">
                  {session.user.email}
                </p>
              </div>
              {session.user.role === "admin" && (
                <div className="pt-4 border-t border-border">
                  <Button
                    asChild
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                  >
                    <Link href="/admin/dashboard">Admin Dashboard</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Orders */}
            <Card className="hover:border-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="w-5 h-5 text-accent" />
                  Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View your order history and track shipments.
                </p>
                <Button
                  asChild
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link href="/orders">View Orders</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Wishlist */}
            <Card className="hover:border-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Heart className="w-5 h-5 text-accent" />
                  Wishlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Save your favorite items for later.
                </p>
                <Button
                  asChild
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link href="/wishlist">View Wishlist</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Profile Settings */}
            <Card className="hover:border-accent transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-5 h-5 text-accent" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your account preferences.
                </p>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  disabled
                >
                  Edit Profile (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="hover:border-accent transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <HelpCircle className="w-5 h-5 text-accent" />
                  Help & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Get in touch with our support team.
                </p>
                <Button
                  onClick={handleEmail}
                  variant="outline"
                  className="w-full justify-start text-left bg-transparent"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  variant="outline"
                  className="w-full justify-start text-left bg-transparent"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
