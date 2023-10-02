"use client";
import CardNavbar from "@/components/CardNavbar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

function Container({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="container mx-auto px-3 pt-2 md:pt-0 md:px-20 gap-2 pb-6 flex my-auto h-full min-h-screen overflow-hidden md:justify-center flex-col">
        <Navbar />
        <div className="w-full h-full min-h-screen flex-col flex items-center">
          <CardNavbar />
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Container;
