import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jobilla - AI Resume Transformation",
  description: "Transform your serious resume into hilarious regional job descriptions. AI-powered career destruction tool that nobody asked for.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <link 
          href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700,1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased bg-neutral-50 text-neutral-900 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}