"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LogIn } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "Sign-in is temporarily unavailable. Please try again later.",
  OAuthCallback: "We couldn't complete sign-in. Please try again.",
  AccessDenied: "Access was denied. Please use an approved Google account.",
  Default: "Sign-in failed. Please try again.",
};

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-2">Sign in to continue</h1>
      <p className="text-text-secondary mb-8">
        Save your learning progress across devices with Google Sign-In.
      </p>

      {error && (
        <p className="mb-6 w-full rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default}
        </p>
      )}

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent/90"
      >
        <LogIn className="h-4 w-4" />
        Continue with Google
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <LoginContent />
    </Suspense>
  );
}
