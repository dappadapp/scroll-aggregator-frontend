import Providers from "@/provider/Providers";
import type { Metadata } from "next";
import { Orbitron, Raleway } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Container from "@/container/container";

const inter = Orbitron({
  subsets: ["latin"],
  variable: "--font-inter",
});
const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Aggre",
  description:
    "Unlock the full potential of the Scroll blockchain with AGGRE, the world's first aggregator dedicated to Scroll. AGGRE provides a unified gateway to explore, trade, and harness the power of Scroll's decentralized ecosystem.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://price-static.crypto.com/latest/public/static/widget/index.js" />
        <script
          type="text/javascript"
          src="https://www.bugherd.com/sidebarv2.js?apikey=rtp3yqfdikrd7pfzs4czgg"
          async={true}
        ></script>
      </head>
      <body className={`${raleway.variable} ${inter.className} tracking-wider`}>
        <Providers>
          <div className="relative w-full min-h-screen mx-auto overflow-x-hidden font-raleway">
            <Container>{children}</Container>
            <div className="w-full -z-10 h-0 lg:h-full bg-[#000814] absolute top-0 overflow-hidden"></div>
            <ToastContainer position="top-right" theme="dark" />
          </div>
        </Providers>
      </body>
    </html>
  );
}
