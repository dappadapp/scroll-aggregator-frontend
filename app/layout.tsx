import Script from "next/script";
import { League_Spartan } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Providers from "@/provider/Providers";
import { GlobalContextProvider } from "@/contexts/globalContext";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import CardNavbar from "@/components/CardNavbar";
import Footer from "@/components/Footer";

const spartan = League_Spartan({ subsets: ["latin"], variable: "--font-spartan", style: "normal" });

export const metadata = {
  title: "aggre! | Scroll DEX Aggregator",
  description: "Discover the future of decentralized trading with Aggre, your one-stop DEX aggregator at Scroll Network. Seamlessly scroll through diverse decentralized exchanges, finding the best prices and liquidity. Trade with confidence, all in one place",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://price-static.crypto.com/latest/public/static/widget/index.js" />
        <Script id="google-analytics" strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=G-61SJVDE3XK`}/>
        <Script strategy="lazyOnload" id="google-analytics">{`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-61SJVDE3XK', {page_path: window.location.pathname,});`}</Script>
        {/* <script type="text/javascript" src="https://www.bugherd.com/sidebarv2.js?apikey=rtp3yqfdikrd7pfzs4czgg" async={true}></script> */}
      </head>
      <body className={`${spartan.variable} ${spartan.className} lg:body-lg body-sm tracking-wider`}>
        <Providers>
          <GlobalContextProvider>
            <div className="container sm:w-auto xs:w-[425px] w-full relative min-h-screen flex flex-col xs:p-4 p-4 mx-auto items-center">
              <Navbar />
              <div id="container-div" className={"container mx-auto md:pt-0 justify-center gap-2 flex-1 flex my-auto overflow-hidden flex-col"}>
                <div className="w-full flex-col flex items-center xs:mt-6 mt-1 xs:mb-6 mb-3">
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
