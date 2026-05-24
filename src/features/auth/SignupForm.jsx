"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "./useAuth";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import styles from "./AuthForm.module.css";

export function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signup, loginWithGoogle, error } = useAuth();

  const loading = isSubmitting || isGoogleLoading;

  function validate() {
    const errors = {};
    if (!fullName.trim()) errors.fullName = "Full Name is required";
    
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email address";
    
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await signup(email, password, fullName);
    } catch (err) {
      setIsSubmitting(false);
      // If the error is the email confirmation message, treat it as success
      if (err.message.startsWith("Account created!")) {
        setSuccessMessage(err.message);
      }
      // Other errors are displayed via useAuth error state
    }
  }

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className={`${styles.card} animate-scale-in`}>
      <h2 className={styles.title}>Create Account</h2>
      <p className={styles.subtitle}>Get started with TrackHire today</p>

      {error && !error.startsWith("Account created") && <div className={styles.error}>{error}</div>}
      {successMessage && (
        <div className={styles.success}>{successMessage}</div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={validationErrors.fullName}
          disabled={loading}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={validationErrors.email}
          disabled={loading}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={validationErrors.password}
          disabled={loading}
        />

        <Button type="submit" isLoading={isSubmitting} disabled={loading} style={{ width: "100%" }}>
          Sign Up
        </Button>
      </form>

      <div className={styles.divider}>Or continue with</div>

      <Button
        variant="secondary"
        onClick={handleGoogleLogin}
        disabled={loading}
        isLoading={isGoogleLoading}
        className={styles.oauthButton}
        icon={
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        }
      >
        Google
      </Button>

      <div className={styles.footer}>
        Already have an account?
        <Link href="/login" className={styles.link}>
          Sign In
        </Link>
      </div>
    </div>
  );
}
