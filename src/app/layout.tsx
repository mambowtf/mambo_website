import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "$MAMBO",
  description: "Memecoin landing with hero signpost + chunky CA banner.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
