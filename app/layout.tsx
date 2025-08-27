import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { Toaster } from "sonner";

import { Providers } from "./providers";
import ContextProvider from "@/providers/AppKitProvider";

import { siteConfig } from "@/config/site";
import RouteAwareNavbar from "@/components/RouteAwareNavbar";
import RouteAwareMain from "@/components/RouteAwareMain";

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body
                className={clsx(
                    "min-h-screen text-foreground antialiased",
                )}
                style={{ backgroundColor: '#ffffff' }}
            >
                <ContextProvider>
                    <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
                        <div className="relative flex flex-col min-h-screen">
                            <RouteAwareNavbar />
                            <RouteAwareMain>
                                {children}
                            </RouteAwareMain>
                        </div>
                        <Toaster
                            position="top-center"
                            toastOptions={{
                                style: {
                                    height: '48px',
                                    fontSize: '13px',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '0px',
                                },
                                classNames: {
                                    success: 'toast-success',
                                    error: 'toast-error',
                                },
                            }}
                        />
                    </Providers>
                </ContextProvider>
            </body>
        </html>
    );
}
