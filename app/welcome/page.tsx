import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { signOut } from "@/app/welcome/actions";

export default function WelcomePage() {
  return <Suspense fallback={<main className="success-page"><div className="success-topbar"><Link href="/" className="brand"><Image src="/adgo-logo-transparent.png" alt="AdGo" className="brand-logo" width={1928} height={815} /></Link></div><p className="success-footer">Ielādējam jūsu profilu…</p></main>}><UserWelcome /></Suspense>;
}

async function UserWelcome() {
  if (!hasSupabaseEnv()) redirect("/?error=configuration");
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/");

  const metadata = user.user_metadata ?? {};
  const providedName = firstString(metadata.full_name, metadata.name);
  const fullName = providedName || "AdGo dalībnieks";
  const firstName = providedName?.trim().split(/\s+/)[0] || "draugs";
  const picture = firstString(metadata.avatar_url, metadata.picture);

  return (
    <main className="success-page">
      <header className="success-topbar"><Link href="/" className="brand"><Image src="/adgo-logo-transparent.png" alt="AdGo" className="brand-logo" width={1928} height={815} /></Link><form action={signOut}><button className="button button-outline" type="submit">Izrakstīties <span aria-hidden="true">↗</span></button></form></header>
      <section className="success-card">
        <div className="success-check" aria-hidden="true">✓</div>
        <p className="eyebrow">JŪS ESAT GAIDĪTĀJU SARAKSTĀ</p>
        <h1>Jūs esat sarakstā, {firstName}!</h1>
        <p className="success-intro">Paldies, ka interesējaties par AdGo. Sazināsimies, kad būs jaunumi.</p>
        <div className="profile-card">
          {picture ? <Image unoptimized width={108} height={108} className="profile-picture" src={picture} alt={`Google profila attēls: ${fullName}`} referrerPolicy="no-referrer" /> : <div className="profile-fallback" aria-hidden="true">{firstName.charAt(0).toUpperCase()}</div>}
          <div className="profile-info"><b>{fullName}</b><span>{user.email}</span><small><i /> Pievienots AdGo gaidītāju sarakstam</small></div>
          <span className="profile-check" aria-label="Apstiprināts">✓</span>
        </div>
        <details className="metadata-details"><summary>Google profila informācija</summary><pre>{JSON.stringify(metadata, null, 2)}</pre></details>
        <Link className="back-link" href="/">← Atgriezties sākumlapā</Link>
      </section>
      <footer className="success-footer">© {new Date().getFullYear()} AdGo · AI palīdz, cilvēki parūpējas.</footer>
    </main>
  );
}

function firstString(...values: unknown[]): string | null {
  return values.find((value): value is string => typeof value === "string" && value.trim().length > 0)?.trim() ?? null;
}
