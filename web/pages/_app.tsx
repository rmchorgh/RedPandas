import type { AppType } from "next/app";
import { trpc } from "../lib/client/trpc";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";
import Auth from "../components/Auth";
import { Inter } from "@next/font/google";
import "../styles/globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>RedPandas</title>
      </Head>
      <ClerkProvider {...pageProps}>
        <main className={`${inter.variable} font-sans`}>
          <Auth>
            <Component {...pageProps} />
          </Auth>
        </main>
      </ClerkProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
