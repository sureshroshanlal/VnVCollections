import type { Metadata } from "next";
import { Playfair_Display, Cinzel, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vaarahi Vaagdevi Collections | Exclusive Handcrafted Sarees & Silks",
  description:
    "Discover authentic Kanjeevaram, Banarasi, Paithani, Organza, and bridal handcrafted sarees. Direct WhatsApp concierge & luxury showcase.",
  keywords: [
    "Vaarahi Vaagdevi",
    "Saree Boutique",
    "Kanjeevaram Silk",
    "Banarasi Sarees",
    "Bridal Trousseau",
    "Handloom Sarees",
    "Pure Zari Silks",
  ],
  openGraph: {
    title: "Vaarahi Vaagdevi Collections - Royal Heritage Weaves",
    description: "Curated luxury sarees directly from master weavers. Enquire & order on WhatsApp.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cinzel.variable} ${outfit.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-[#FAF7F2] text-[#1A1617] antialiased selection:bg-[#D4AF37]/30 selection:text-[#4D0917]">
        {children}
      </body>
    </html>
  );
}
