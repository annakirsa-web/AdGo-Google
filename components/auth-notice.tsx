"use client";

import { useSearchParams } from "next/navigation";

export function AuthNotice() {
  const params = useSearchParams();
  const error = params.get("error");
  if (!error) return null;

  const message = error === "configuration"
    ? "Pievienošanās vēl nav konfigurēta. Pārbaudiet .env.local iestatījumus."
    : error === "save_failed"
      ? "Pieteikšanos izdevās apstiprināt, taču saglabāšana neizdevās. Lūdzu, mēģiniet vēlreiz."
      : "Neizdevās pabeigt pieteikšanos. Lūdzu, mēģiniet vēlreiz.";

  return <p className="error-message" role="alert">{message}</p>;
}
