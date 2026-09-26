import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ShieldCheck, Users, UserPlus } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insurance CRM",
  description: "Manage insurance policies and clients",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
                <span className="font-bold text-xl text-slate-800 tracking-tight">InsureCRM</span>
              </div>
              <nav className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-1 text-slate-600 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-slate-50">
                  <Users className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/add-user" className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors px-4 py-2 rounded-lg shadow-sm">
                  <UserPlus className="h-4 w-4" />
                  <span>Add Client</span>
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
