"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Recipes" },
  { href: "/planner", label: "Planner" },
  { href: "/shopping-list", label: "Shopping List" },
  { href: "/favorites", label: "Favorites" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-bold text-brand-600">
          🍳 Recipe Book
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto sm:gap-2">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium transition sm:px-3 ${
                  active ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/recipes/new"
            className="ml-1 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-sm font-medium text-white hover:bg-gray-800 sm:px-3"
          >
            + New
          </Link>
        </div>
      </nav>
    </header>
  );
}
