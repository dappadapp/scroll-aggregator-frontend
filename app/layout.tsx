"use client";
import Providers from "@/provider/Providers";
import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import CardNavbar from "@/components/CardNavbar";

const inter = Inter({
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
      <body className={`${raleway.variable} ${inter.variable}`}>
        <Providers>
          <div className={"relative w-full min-h-screen overflow-x-hidden font-raleway"}>
            <div
              className={
                "container mx-auto px-3 pt-2 md:px-20 gap-2 pb-6 flex my-auto h-full min-h-screen overflow-hidden md:justify-center flex-col"
              }
            >
              <Navbar />
              <div className="w-full h-full flex-col flex items-center">
                <CardNavbar />
                {children}
              </div>
              <Footer />
            </div>
            <div className="w-full -z-10 h-0 lg:h-full bg-[#000814] absolute top-0 overflow-hidden">
              {/* <div
                className={`absolute h-[0vh] md:h-[120vh] blur-[2px] bg-opacity-30 overflow-hidden top-0 aspect-square bg-[radial-gradient(circle,#ffcd2c,#c99d32,#937132,#5d492d,#272625)] 
                left-0 md:translate-x-[-70%] translate-x-[-90%]
            rounded-full`}
              ></div>
              <div
                className={`absolute h-[0vh] md:h-[120vh] blur-[2px] bg-opacity-30 overflow-hidden top-0 bg-[radial-gradient(circle,#ffcd2c,#c99d32,#937132,#5d492d,#272625)] aspect-square 
                 right-0 md:translate-x-[70%] translate-x-[90%]
             rounded-full`}
              ></div> */}
            </div>
            <ToastContainer position="top-right" theme="dark" />
          </div>
        </Providers>
      </body>
    </html>
  );
}
