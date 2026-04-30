import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOBBERS - Tech Events in Zurich",
  description: "Find highly relevant, niche IT/Data events in Zurich in under two minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

// Made with Bob
