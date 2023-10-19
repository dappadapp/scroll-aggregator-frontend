import Providers from "@/provider/Providers";
import type { Metadata } from "next";
import { Orbitron, Raleway, Montserrat, League_Spartan } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Container from "@/container/container";
import Navbar from "@/components/Navbar";
import CardNavbar from "@/components/CardNavbar";
import Footer from "@/components/Footer";
import { GlobalContextProvider } from "@/contexts/globalContext";

const inter = Orbitron({
  subsets: ["latin"],
  variable: "--font-inter",
});
const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

const monteserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-spartan",
  weight: "500",
});

const spartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-spartan",
  style: "normal",
});

export const metadata = {
  title: "aggre! | Scroll DEX Aggregator",
  description:
    "Discover the future of decentralized trading with Aggre, your one-stop DEX aggregator at Scroll Network. Seamlessly scroll through diverse decentralized exchanges, finding the best prices and liquidity. Trade with confidence, all in one place",
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

        <Script
          id="google-analytics"
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=G-61SJVDE3XK`}
        />
        <Script strategy="lazyOnload" id="google-analytics">
          {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-61SJVDE3XK', {
                    page_path: window.location.pathname,
                    });
        `}
        </Script>
        <script
          type="text/javascript"
          src="https://www.bugherd.com/sidebarv2.js?apikey=rtp3yqfdikrd7pfzs4czgg"
          async={true}
        ></script>
      </head>
      <body
        className={`${spartan.variable} ${spartan.className} h-full tracking-wider text-[20px]`}
      >
        <Providers>
          <GlobalContextProvider>
            <div
              className={
                "relative container min-h-screen h-full flex flex-col px-3 mx-auto items-center md:px-20 overflow-x-hidden"
              }
            >
              <Navbar />
              <div
                id="container-div"
                className={
                  "container mx-auto z-10 md:pt-0 justify-center md:px-20 gap-2 flex-1  flex my-auto h-full min-h-screen overflow-hidden  flex-col"
                }
              >
                <div className="w-full h-full min-h-[70vh] relative flex-col flex items-center mb-5">
                  <CardNavbar />
                  {children}
                </div>
              </div>
              <Footer />
              <ToastContainer position="top-right" theme="dark" />
            </div>
          </GlobalContextProvider>
        </Providers>
      </body>
    </html>
  );
}
