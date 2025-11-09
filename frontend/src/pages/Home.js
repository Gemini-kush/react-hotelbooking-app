import React from "react";
import NavBar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import WelcomeSection from "../components/WelcomeSection";
import RoomsSection from "../components/RoomsSection";
import LocationSection from "../components/LocationSection";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <HeroSection />
      <WelcomeSection />
      <RoomsSection />
      <LocationSection />
    </>
  );
}

export default Home;
