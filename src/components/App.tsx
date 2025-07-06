"use client";
import React from "react";
import Image from "next/image";
import { ScrollTrigger, SplitText } from "gsap/all";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Cocktails from "./Cocktails";
import About from "./About";
import Art from "./Art";
import Menu from "./Menu";
import Contact from "./Contact";

gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <Cocktails />
      <About />
      <Art />
      <Menu />
      <Contact />
    </main>
  );
};

export default App;
