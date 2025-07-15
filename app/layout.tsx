import type { Metadata } from "next";
import "./globals.css";
import { LayoutProvider } from "@/components/layout/layout-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Poppins } from "next/font/google";
import { Style_Script } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const styleScript = Style_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-style",
});
export const metadata: Metadata = {
  title: "Tours",
  description: "Tours, Events, Destinations, All in One Place",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <SessionWrapper>
    <html
      lang="en"
      className={`${styleScript.variable} ${poppins.className}`}
      suppressHydrationWarning
    >
      <body className="min-h-screenn font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <TooltipProvider>
            <LayoutProvider>{children}</LayoutProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
    // </SessionWrapper>
  );
}
