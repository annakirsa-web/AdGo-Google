"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = { compact?: boolean };

export function GoogleSignInButton({ compact = false }: Props) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function signIn() {
    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/welcome` },
      });
      if (error) throw error;
      if (!data.url) throw new Error("Google sign-in URL was not returned.");
      window.location.assign(data.url);
    } catch {
      setMessage("Pieteikšanās pašlaik nav pieejama. Pārbaudiet Supabase iestatījumus un mēģiniet vēlreiz.");
      setBusy(false);
    }
  }

  return (
    <div className="google-action">
      <button className={`button google-button${compact ? " button-compact" : ""}`} type="button" onClick={signIn} disabled={busy}>
        <GoogleIcon />
        {busy ? "Savienojam ar Google…" : "Pievienoties ar Google"}
        <span aria-hidden="true" className="button-arrow">↗</span>
      </button>
      {message && <p className="error-message" role="alert">{message}</p>}
    </div>
  );
}

function GoogleIcon() {
  return <svg aria-hidden="true" className="google-icon" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(4 4) scale(.83)"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94a11.1 11.1 0 0 1-4.8 7.27l7.73 6C44.38 38.08 46.98 31.84 46.98 24.55Z" transform="translate(2 2) scale(.9)"/><path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.77 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z" transform="translate(4 4) scale(.83)"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.77l-7.73-6c-2.14 1.45-4.89 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" transform="translate(4 4) scale(.83)"/></svg>;
}
