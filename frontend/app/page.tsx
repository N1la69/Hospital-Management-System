"use client";

import AboutSection from "@/components/homepage/AboutSection";
import GallerySection from "@/components/homepage/GallerySection";
import HeroSection from "@/components/homepage/HeroSection";
import ServicesSection from "@/components/homepage/ServicesSection";
import TrustSection from "@/components/homepage/TrustSection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrustSection />
        <ServicesSection />
        <AboutSection />
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
