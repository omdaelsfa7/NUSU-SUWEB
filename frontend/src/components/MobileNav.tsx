"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Calendar, ShieldCheck } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/board", label: "Board", icon: Users },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/admin", label: "Admin", icon: ShieldCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-xl px-3 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href === "/admin" && pathname.startsWith("/admin"));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-[#018BCE]"
                  : "text-slate-500 hover:text-[#0F3056]"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? "bg-[#018BCE]/10 text-[#018BCE]" : "text-slate-500"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[11px] mt-0.5 font-medium ${isActive ? "font-bold text-[#0F3056]" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
