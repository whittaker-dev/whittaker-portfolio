import {
  FeatureFlag,
  I18NClientProvider,
  MotionProvider,
  QueryClientWrapper,
  ThemeProvider,
  ToasterProvider,
} from "@/providers";
import { THEME_STORAGE_KEY } from "@/providers/Theme/theme.constants";
import type { Metadata, Viewport } from "next";
import { Anton, Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin", "vietnamese"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Whittaker Tran — Software Engineer",
  description:
    "Whittaker Tran, full-stack software engineer in Ho Chi Minh City. React, Next.js, Node.js, TypeScript and AWS.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0e13" },
    { media: "(prefers-color-scheme: light)", color: "#f4f2ec" },
  ],
};

// Runs before first paint so a stored "light" choice never flashes the dark default (or vice versa).
const themeBootScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"){document.documentElement.classList.add("dark")}}catch(e){document.documentElement.classList.add("dark")}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <link
          rel="icon"
          href="/assets/images/logo-ico.jpeg"
          type="image/png"
          sizes="32x32"
        />
      </head>
      <body
        className={`${anton.variable} ${beVietnam.variable} ${jetBrainsMono.variable}`}
        suppressHydrationWarning
      >
        <NextTopLoader showSpinner={false} color="#0a21c0" />
        <QueryClientWrapper>
          <I18NClientProvider>
            <ToasterProvider>
              <ThemeProvider>
                <MotionProvider>
                  <FeatureFlag>{children}</FeatureFlag>
                </MotionProvider>
              </ThemeProvider>
            </ToasterProvider>
          </I18NClientProvider>
        </QueryClientWrapper>
      </body>
    </html>
  );
}
