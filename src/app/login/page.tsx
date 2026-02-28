"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        name: isSignUp ? name : "",
        isSignUp: isSignUp ? "true" : "false",
        redirect: false,
      });

      if (result?.error) {
        setError(isSignUp ? "Email already exists or invalid data" : "Invalid email or password");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <Link href="/" className="flex items-center justify-center gap-2 mb-8">
        <span className="text-3xl">⚡</span>
        <span className="text-2xl font-bold">EasyClaw</span>
      </Link>

      {/* Card */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-[var(--muted)] text-center text-sm mb-8">
          {isSignUp
            ? "Sign up to deploy your AI assistant"
            : "Sign in to manage your AI assistant"}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-white placeholder-[var(--muted)] focus:outline-none focus:border-indigo-500 transition"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-white placeholder-[var(--muted)] focus:outline-none focus:border-indigo-500 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-white placeholder-[var(--muted)] focus:outline-none focus:border-indigo-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-semibold py-3 rounded-lg transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isSignUp ? "Creating Account..." : "Signing In..."}
              </span>
            ) : (
              <>{isSignUp ? "Create Account" : "Sign In"}</>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-[var(--muted)]">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </span>{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-[var(--muted)] mt-8">
        By continuing, you agree to our{" "}
        <Link href="#" className="text-indigo-400 hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-indigo-400 hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}

function LoginLoading() {
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center gap-2 mb-8">
        <span className="text-3xl">⚡</span>
        <span className="text-2xl font-bold">EasyClaw</span>
      </div>
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8">
        <div className="flex items-center justify-center py-8">
          <span className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<LoginLoading />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
