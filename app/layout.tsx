import Providers from "@/provider/Providers";
import type { Metadata } from "next";
import { Orbitron, Raleway } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Container from "@/container/container";
import Navbar from "@/components/Navbar";
import CardNavbar from "@/components/CardNavbar";
import Footer from "@/components/Footer";

const inter = Orbitron({
  subsets: ["latin"],
  variable: "--font-inter",
});
const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});


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
         </head>
      <body className={`${raleway.variable} ${inter.className} tracking-wider`}>
        <Providers>
          <div className={"relative w-full min-h-screen overflow-x-hidden font-raleway"}>
            <div
              className={
                "container mx-auto px-3 pt-2 md:pt-0 md:px-20 gap-2 pb-6 flex my-auto h-full min-h-screen overflow-hidden md:justify-center flex-col"
              }
            >
              <Navbar />
              <div className="w-full h-full flex-col flex items-center mb-5">
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
