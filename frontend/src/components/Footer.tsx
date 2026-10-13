import Link from "next/link";
import { Mail, MapPin, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F3056] text-white mt-auto border-t border-slate-700/50 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 text-white flex flex-col items-center justify-center border border-white/20">
                <span className="font-display text-lg tracking-wider font-bold leading-none text-white">NU</span>
                <span className="text-[9px] font-semibold tracking-widest text-[#018BCE] uppercase leading-none mt-0.5">SU</span>
              </div>
              <div>
                <h3 className="font-display text-xl tracking-wide uppercase text-white">
                  Nile University Student Union
                </h3>
                <p className="text-xs text-slate-300 font-medium tracking-wide">
                  Official NUSU Student Representation Portal
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md font-body">
              Representing Nile University students, fostering student leadership, organizing transformative campus life experiences, and championing academic excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-[#018BCE] uppercase font-body">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/board" className="hover:text-white transition-colors">
                  Board Members Directory
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Events & Calendar
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#018BCE] transition-colors">
                  Admin Control Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-[#018BCE] uppercase font-body">
              Campus Headquarters
            </h4>
            <div className="space-y-2.5 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#018BCE] shrink-0 mt-0.5" />
                <span>Nile University Campus, 26th of July Corridor, Sheikh Zayed City, Giza</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#018BCE] shrink-0" />
                <a href="mailto:su@nu.edu.eg" className="hover:text-white transition-colors">
                  su@nu.edu.eg
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#018BCE] shrink-0" />
                <a href="https://nu.edu.eg" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  nu.edu.eg
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Nile University Student Union (NUSU). All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Built for Nile University Students</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
