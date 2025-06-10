"use client";

import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';

export default function Header() {
  const { pathname } = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-lg">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-8">
            <Link
              href="https://www.reversoz.com/"
              className={`text-lg font-semibold transition-colors duration-300 ${
                pathname === "/" ? "text-white underline" : "text-gray-200 hover:text-white"
              }`}
            >
              Back to Site
            </Link>
          </div>
          {/* Wallet Connect Button */}
          <div>
            <ConnectButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
