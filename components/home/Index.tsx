"use client";

import React, { useEffect, useState } from "react";
import HomeBanner from "./Banner";
import MobileList from "./MobileList";
const Home = () => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="relative w-full">
      <HomeBanner />
      <MobileList />
    </div>
  );
};

export default Home;
