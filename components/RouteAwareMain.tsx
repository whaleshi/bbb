"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function RouteAwareMain({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isGooey = pathname === "/gooey" || pathname.startsWith("/gooey/");

    if (isGooey) {
        return (
            <main className="flex-grow p-0 m-0 w-full h-auto">
                {children}
            </main>
        );
    }

    return (
        <main className="container flex-grow px-[16px] mx-auto max-w-[450px] pt-[56px]">
            {children}
        </main>
    );
}
