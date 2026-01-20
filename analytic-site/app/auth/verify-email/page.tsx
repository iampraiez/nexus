"use client";

import { useState } from "react";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";
import Loading from "./loading";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const companyId = searchParams.get("companyId");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  if (!companyId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <Card className="p-6 text-center max-w-md border border-destructive/20">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-foreground font-medium mb-2">Invalid Request</p>
          <p className="text-muted-foreground text-sm mb-4">
            Company ID is missing. Please start the registration process again.
          </p>
          <Button
            onClick={() => router.push("/auth/register")}
            className="w-full"
          >
            Back to Registration
          </Button>
        </Card>
      </div>
    );
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Verification failed");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendLoading(true);
    setResendSuccess("");
    setError("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend code");
        return;
      }

      setResendSuccess("Verification code resent successfully!");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setResendLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md">
          <Card className="p-6 text-center border border-border bg-card">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Email Verified!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your email has been successfully verified. You&apos;ll be
              redirected to the login page...
            </p>
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
              Verify Your Email
            </h1>
            <p className="text-muted-foreground text-center">
              We&apos;ve sent a verification code to your email. Enter it below
              to continue.
            </p>
          </div>

          <Card className="p-6 border border-border bg-card">
            <form onSubmit={handleVerify} className="space-y-6">
              {error && (
                <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {resendSuccess && (
                <div className="flex gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-primary">{resendSuccess}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  required
                  disabled={loading}
                  className="text-center text-2xl tracking-widest font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  6-digit code from your email
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Verify Email"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Didn&apos;t receive the code?{" "}
              <button 
                onClick={handleResend}
                disabled={resendLoading}
                className="text-primary hover:underline font-medium disabled:opacity-50"
              >
                {resendLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Resend email"
                )}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </Suspense>
  );
}
