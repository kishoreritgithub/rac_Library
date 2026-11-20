import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/rac/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAC Library | Reusable animation components",
  description: "Dependency-free React animation components with their own CSS.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
