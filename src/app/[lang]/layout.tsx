import {
  I18NClientProvider,
  QueryClientWrapper,
  ThemeProvider,
  ToasterProvider,
} from "@/providers";
import type { Metadata } from "next";
import { JetBrains_Mono, Montserrat } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "James Whittaker",
  description: "James Whittaker - Full Stack Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Boldonse&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body
        className={`${montserrat.variable} ${jetBrainsMono.variable}`}
        suppressHydrationWarning
      >
        <NextTopLoader showSpinner={false} color="#0a21c0" />
        <QueryClientWrapper>
          <I18NClientProvider>
            <ToasterProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </ToasterProvider>
          </I18NClientProvider>
        </QueryClientWrapper>
      </body>
    </html>
  );
}
