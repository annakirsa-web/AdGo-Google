import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { AuthNotice } from "@/components/auth-notice";

const steps = [
  { number: "01", title: "Pastāstiet par savu uzņēmumu", detail: "Kas jūs esat, ko piedāvājat un kur atrodaties?" },
  { number: "02", title: "Apskatiet reklāmu un izvēlieties budžetu", detail: "Kopā sagatavosim ideju, tekstu un piemērotu budžetu." },
  { number: "03", title: "Uzticiet kampaņu AdGo komandai", detail: "Mēs pārbaudīsim iestatījumus un palīdzēsim vadīt kampaņu." },
];

export default function Home() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="AdGo sākumlapa">
          <Image src="/adgo-logo-transparent.png" alt="AdGo" className="brand-logo" width={1928} height={815} priority />
        </Link>
        <nav aria-label="Galvenā navigācija" className="topnav">
          <a href="#ka-strada">Kā tas strādā</a>
          <a className="button button-small" href="#pievienoties">Pievienoties <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> REKLĀMA MAZIEM UZŅĒMUMIEM</p>
          <h1>Jūsu uzņēmums.<br />Nākamie klienti.<br /><span>Sāksim reklāmu.</span></h1>
          <p className="hero-description">Veidojiet Facebook un Instagram kampaņas ar AI palīdzību un īstu komandu līdzās. Radīts mazajiem uzņēmumiem.</p>
          <div className="hero-actions" id="pievienoties">
            <GoogleSignInButton />
            <span className="free-note"><span aria-hidden="true">✓</span> Pievienošanās ir bez maksas</span>
          </div>
          <Suspense fallback={null}><AuthNotice /></Suspense>
          <p className="trust-note">AI palīdz sagatavot reklāmu. AdGo komanda to pārbauda un palīdz ar kampaņu.</p>
          <div className="platform-strip" aria-label="Reklāmas platformas">
            <span className="platform-label">Platformas</span>
            <span><b className="platform-facebook">f</b>Facebook</span>
            <span><b className="platform-instagram">◎</b>Instagram</span>
            <span><b className="platform-tiktok">♪</b>TikTok</span>
            <span><b className="platform-google">G</b>Google Ads</span>
          </div>
        </div>

        <div className="preview-wrap" aria-label="Ilustratīvs reklāmas sagatavošanas piemērs">
          <div className="preview-orbit orbit-one" />
          <div className="preview-orbit orbit-two" />
          <div className="preview-window">
            <div className="preview-window-top"><span className="window-dots"><i /><i /><i /></span><span>JŪSU REKLĀMAS IDEJA</span><span className="preview-status"><i /> Melnraksts</span></div>
            <div className="preview-content">
              <div className="business-photo" aria-hidden="true"><span className="sun-shape" /><span className="cup-shape">☕</span><span className="leaf-shape">✳</span><span className="photo-caption">KAFIJA · RĪGA</span></div>
              <div className="ad-copy">
                <div className="ad-brand"><span className="avatar-mark">K</span><div><b>Kaimiņu kafija</b><small>Sponsored · Facebook</small></div><span className="more-dots">•••</span></div>
                <p>Rīti garšo labāk ar svaigi grauzdētu kafiju. Ienāciet pēc savas iecienītās krūzes! ☕</p>
                <div className="ad-link"><div><small>KAIMINUKAFIJA.LV</small><b>Svaiga kafija tepat blakus</b></div><span>Apskatīt</span></div>
              </div>
              <div className="preview-bottom"><span><b>✦</b> Sagatavošanā ar AI</span><span className="review-pill"><i /> Pārbauda AdGo komanda</span></div>
            </div>
          </div>
          <div className="floating-note"><span className="floating-icon">↗</span><span><b>Vienkārši un saprotami</b><small>Jūs izvēlaties budžetu</small></span></div>
          <span className="preview-star star-one">✳</span><span className="preview-star star-two">✳</span>
        </div>
      </section>

      <section className="how-section" id="ka-strada">
        <div className="section-heading"><p className="eyebrow">NO IDEJAS LĪDZ KAMPAŅAI</p><h2>Reklāma bez liekas sarežģīšanas.</h2><p>Jūs pazīstat savu uzņēmumu. Mēs palīdzēsim to parādīt īstajiem cilvēkiem.</p></div>
        <div className="steps-grid">{steps.map((step) => <article className="step-card" key={step.number}><span className="step-number">{step.number}</span><h3>{step.title}</h3><p>{step.detail}</p></article>)}</div>
      </section>

      <section className="closing-card"><div><p className="eyebrow">VĒLATIES UZZINĀT PIRMAIS?</p><h2>Pievienojieties AdGo gaidītāju sarakstam.</h2><p>Pieteikšanās ir bez maksas. Sāksim ar jūsu uzņēmuma stāstu.</p></div><div className="closing-action"><GoogleSignInButton compact /><span>Ātri un droši ar Google</span></div></section>
      <footer className="footer"><Link href="/" className="footer-brand"><Image src="/adgo-logo-transparent.png" alt="AdGo" width={1928} height={815} /></Link><p>Reklāma, kas sākas ar labu sarunu.</p><span>© 2026 AdGo</span></footer>
    </main>
  );
}
