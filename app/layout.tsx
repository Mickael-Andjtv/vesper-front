import type { Metadata } from "next";
import "../styles/globals.css";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Vesper",
  description: "Lovable Generated Project",
  authors: [{ name: "Lovable" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Vesper",
    description: "Lovable Generated Project",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Lovable",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactQueryProvider>
        <body>{children}</body>
      </ReactQueryProvider>
    </html>
  );
}
