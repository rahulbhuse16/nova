"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { GradientBackground } from "@/components/shared/GradientBackground";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { Divider } from "@/components/shared/Divider";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { TextField } from "@/components/inputs/TextField";
import { Switch } from "@/components/inputs/Switch";
import { loginWithEmail, loginWithGoogle, signUpWithEmail } from "@/services/auth";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Brand glyphs — kept local since these aren't in lucide-react and    */
/* the system avoids pulling in a whole icon-brand package for three.  */
/* ------------------------------------------------------------------ */

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.55-5.17 3.55-8.66z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.29v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.29 14.31A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.58.38-2.31v-3.1H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.4z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.6l4 3.1C6.23 6.86 8.88 4.75 12 4.75z" />
    </svg>
  );
}

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.36 1.44c0 1.14-.42 2.2-1.24 3.06-.87.9-2.06 1.53-3.16 1.44-.13-1.12.41-2.26 1.2-3.06.85-.87 2.24-1.5 3.2-1.44zm3.44 16.7c-.46 1.05-.68 1.51-1.27 2.44-.83 1.29-2 2.9-3.45 2.92-1.29.02-1.63-.85-3.38-.84-1.75.01-2.12.86-3.41.84-1.46-.02-2.56-1.47-3.39-2.75-2.32-3.58-2.56-7.79-1.13-10.03.99-1.57 2.56-2.49 4.03-2.49 1.5 0 2.44.86 3.68.86 1.2 0 1.94-.86 3.68-.86 1.31 0 2.7.72 3.69 1.96-3.24 1.78-2.72 6.42.95 7.95z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type AuthMode = "sign-in" | "sign-up";

export interface SocialProvider {
  id: "google" | "apple" | "microsoft";
  label: string;
  icon: React.ReactNode;
}

const SOCIAL_PROVIDERS: SocialProvider[] = [
  { id: "google", label: "Continue with Google", icon: <GoogleGlyph className="h-[18px] w-[18px]" /> },
];

export interface AuthProps {
  mode?: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
  onSubmit?: (data: { email: string; password: string; mode: AuthMode }) => void | Promise<void>;
  onSocialLogin?: (provider: SocialProvider["id"]) => void | Promise<void>;
  onForgotPassword?: () => void;
  loading?: boolean;
  error?: string;
}

/**
 * Nova's authentication screen. Same glass/gradient/breathing language as
 * the rest of the app — this is the first thing anyone sees, so it should
 * feel like the companion, not a form. Composed entirely from existing
 * Nova components (GradientBackground, GlassPanel, PrimaryButton,
 * SecondaryButton, TextField, AnimatedSection).
 */
export function Auth({
  mode: controlledMode,
  onModeChange,
  onSubmit,
  onSocialLogin,
  onForgotPassword,
  loading = false,
  error,
}: AuthProps) {
  const navigate=useNavigate()
  const [internalMode, setInternalMode] = React.useState<AuthMode>("sign-in");
  const mode = controlledMode ?? internalMode;

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [socialLoading, setSocialLoading] = React.useState<SocialProvider["id"] | null>(null);
  const[loader,setLoader]=React.useState(false)
  const[name,setName]=React.useState('')


  function setMode(next: AuthMode) {
    setInternalMode(next);
    onModeChange?.(next);
  }

 async function handleSubmit(e: React.FormEvent) {
     setLoader(true)
     try{


         if(mode==='sign-in'){
            await loginWithEmail(email,password)
            navigate('/today')
         }
         else if(mode==='sign-up'){
          await signUpWithEmail(name,email,password)
          navigate('/today')
         }
              setLoader(false)



     }
     catch(err){
      setLoader(false)

     }
     finally{
      setLoader(false)

     }
    
  }

  async function handleSocial(id: SocialProvider["id"]) {
     loginWithGoogle()
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <GradientBackground />

      <AnimatedSection kind="scale" className="w-full max-w-md">
        <GlassPanel radius="lg" floating className="p-8 md:p-10">
          {/* Brand */}
          <div className="mb-8 flex flex-col items-center text-center">
            <motion.span
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center justify-center overflow-hidden"
            >
              <img
                src="/nova_login.png"
                alt="Nova"
                className="h-24 w-auto object-contain"
                draggable={false}
              />
            </motion.span>
            <h1 className="font-display text-2xl tracking-tight text-text">
              {mode === "sign-in" ? "Welcome back" : "Meet Nova"}
            </h1>
            <p className="mt-1.5 max-w-xs text-sm text-text-secondary">
              {mode === "sign-in"
                ? "Sign in to pick up right where you left off."
                : "Create your space to reflect, track, and grow."}
            </p>
          </div>

          {/* Mode switch */}
          <div className="relative mb-6 flex rounded-pill border border-border bg-surface p-1">
            {(["sign-in", "sign-up"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "relative z-10 flex-1 rounded-pill py-2 text-sm font-medium transition-colors",
                  mode === m ? "text-primary-foreground" : "text-text-secondary hover:text-text"
                )}
              >
                {mode === m && (
                  <motion.span
                    layoutId="auth-mode-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-pill shadow-glow"
                    style={{ backgroundImage: "var(--gradient-aurora)" }}
                  />
                )}
                {m === "sign-in" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Social logins */}
          <div className="space-y-2.5">
            {SOCIAL_PROVIDERS.map((provider) => (
              <SecondaryButton
                key={provider.id}
                variant="outline"
                className="w-full justify-center"
                icon={
                  socialLoading === provider.id ? (
                    <Loader2 className="h-[18px] w-[18px] animate-spin" />
                  ) : (
                    provider.icon
                  )
                }
                disabled={!!socialLoading || loading}
                onClick={() => handleSocial(provider.id)}
              >
                {provider.label}
              </SecondaryButton>
            ))}
          </div>

          <Divider label="or continue with email" className="my-6" />

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 rounded-md border border-error/20 bg-error/8 px-3.5 py-2.5 text-sm text-error"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Email / password form */}
          <div className="space-y-4">
            <TextField
              type="email"
              label="Email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <div>
              <TextField
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder={mode === "sign-in" ? "Enter your password" : "Create a password"}
                icon={<Lock className="h-4 w-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                minLength={mode === "sign-up" ? 8 : undefined}
                required
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="relative float-right -mt-[38px] mr-3.5 text-muted hover:text-text"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {
              mode==='sign-up' &&
            
            (<TextField
              type="name"
              label="Name"
              placeholder=""
              icon={<User className="h-4 w-4" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />)}

            <div className="flex items-center justify-between pt-1">
              {mode === "sign-in" ? (
                <>
                  <Switch checked={remember} onChange={setRemember} label="Stay signed in" />
                  {onForgotPassword && (
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </>
              ) : (
                <p className="text-xs leading-relaxed text-muted">
                  By continuing you agree to Nova's Terms and Privacy Policy.
                </p>
              )}
            </div>

            <PrimaryButton
              type="button"
              variant="gradient"
              className="w-full justify-center"
              loading={loader}
              onClick={handleSubmit}
              icon={!loader ? <ArrowRight className="h-4 w-4" /> : undefined}
            >
              {mode === "sign-in" ? "Sign in" : "Create account"}
            </PrimaryButton>
          </div>

          <p className="mt-6 text-center text-sm text-text-secondary">
            {mode === "sign-in" ? "New to Nova?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
              className="font-medium text-primary hover:underline"
            >
              {mode === "sign-in" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </GlassPanel>
      </AnimatedSection>
    </div>
  );
}