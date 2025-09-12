import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner";
import ReactQueryProvider from "@/context/ReactQueryContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "MyKrew | Back Office",
    description: "Tableau de bord administratif pour gérer les consultants, les bureaux, les transactions, les parrainages et les opérations de portage, avec une authentification complète des utilisateurs et un contrôle d’accès basé sur les rôles."
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ReactQueryProvider>
            {children}
        </ReactQueryProvider>
        <Toaster/>
        </body>
        </html>
    );
}
