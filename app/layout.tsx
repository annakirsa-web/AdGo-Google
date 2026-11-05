import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdGo — Sāksim jūsu reklāmu",
  description: "Facebook un Instagram reklāmas mazajiem uzņēmumiem. AI palīdz sagatavot kampaņu, AdGo komanda parūpējas par pārējo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="lv">
      <body>{children}</body>
    </html>
  );
}
