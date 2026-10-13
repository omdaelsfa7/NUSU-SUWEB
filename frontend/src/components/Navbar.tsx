"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, ShieldCheck, Home } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/board", label: "Board Directory", icon: Users },
    { href: "/events", label: "Events & Calendar", icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-[#0F3056] text-white flex flex-col items-center justify-center shadow-md group-hover:bg-[#0F548D] transition-colors">
              <span className="font-display text-lg tracking-wider font-bold leading-none text-white">NU</span>
              <span className="text-[9px] font-semibold tracking-widest text-[#018BCE] uppercase leading-none mt-0.5">SU</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl tracking-wide uppercase text-[#0F3056] leading-tight group-hover:text-[#018BCE] transition-colors">
                Nile University
              </span>
              <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Student Union • NUSU
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#0F3056]/10 text-[#0F3056] font-semibold"
                      : "text-slate-600 hover:text-[#0F3056] hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#018BCE]" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Admin CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/admin"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs ${
                pathname.startsWith("/admin")
                  ? "bg-[#018BCE] text-white shadow-md shadow-[#018BCE]/20"
                  : "bg-[#0F3056] text-white hover:bg-[#0F548D] hover:shadow-md"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
