"use client";

import React, { useEffect, useState } from "react";
import HomeBanner from "./Banner";
import List from "./List";
import PrefetchLinks from "@/components/PrefetchLinks";
import TokenList from "@/components/tokens/TokenList";
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
            {/* <TokenList /> */}
            <List />
            <PrefetchLinks
                paths={['/create', '/about', '/blog', '/pricing']}
                delay={1500}
            />
        </div>
    );
};

export default Home;
