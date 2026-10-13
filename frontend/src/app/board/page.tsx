"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Users,
  GraduationCap,
  Mail,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  BoardMember,
  fetchBoardMembers,
  FALLBACK_BOARD_MEMBERS,
} from "@/lib/api";

const COMMITTEES = ["All", "Executive", "Academics", "Events", "Marketing"];

export default function BoardDirectoryPage() {
  const [members, setMembers] = useState<BoardMember[]>(FALLBACK_BOARD_MEMBERS);
  const [activeCommittee, setActiveCommittee] = useState("All");

  useEffect(() => {
    async function loadMembers() {
      const data = await fetchBoardMembers();
      if (data && data.length > 0) {
        setMembers(data);
      }
    }
    loadMembers();
  }, []);

  const filteredMembers =
    activeCommittee === "All"
      ? members
      : members.filter(
          (m) => m.committee.toLowerCase() === activeCommittee.toLowerCase()
        );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F3056]/5 border border-[#0F3056]/15 text-[#0F3056] text-xs font-semibold tracking-wider uppercase font-body">
          <Sparkles className="w-3.5 h-3.5 text-[#018BCE]" />
          Student Representation & Governance
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#0F3056]">
          NUSU Board Directory
        </h1>
        <p className="text-base text-slate-600 leading-relaxed font-body">
          Meet the elected executive officers and committee directors working every day to amplify student rights, enhance academic curriculum, organize campus life, and represent Nile University.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-b border-slate-200 pb-6">
        {COMMITTEES.map((committee) => {
          const isActive = activeCommittee === committee;
          return (
            <button
              key={committee}
              onClick={() => setActiveCommittee(committee)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all ${
                isActive
                  ? "bg-[#0F3056] text-white shadow-md shadow-[#0F3056]/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {committee}
            </button>
          );
        })}
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {filteredMembers.map((member) => {
          return (
            <div
              key={member.id}
              className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              {/* Photo Area */}
              <div>
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden flex items-center justify-center">
                  {member.imageUrl ? (
                    // Using unoptimized standard image fallback if MinIO is local or offline
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#0F3056]/10 text-[#0F3056] flex items-center justify-center">
                      <Users className="w-8 h-8" />
                    </div>
                  )}

                  {/* Committee Tag overlay */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200/60 text-[11px] font-bold tracking-wider uppercase text-[#0F3056]">
                    {member.committee}
                  </div>
                </div>

                {/* Details Area */}
                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-wide text-[#0F3056] leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold text-[#018BCE] uppercase tracking-wider mt-0.5">
                      {member.role}
                    </p>
                  </div>

                  {member.major && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{member.major}</span>
                    </div>
                  )}

                  {member.bio && (
                    <p className="text-xs text-slate-600 leading-relaxed font-body line-clamp-3 pt-1">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Bar */}
              <div className="p-6 pt-0 mt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#018BCE] transition-colors font-medium truncate"
                    title={member.email}
                  >
                    <Mail className="w-3.5 h-3.5 text-[#018BCE] shrink-0" />
                    <span className="truncate">Contact</span>
                  </a>
                ) : (
                  <span />
                )}

                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#018BCE]/10 text-slate-700 hover:text-[#018BCE] border border-slate-200 transition-colors font-semibold"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500">
          <p className="text-base font-semibold">No board members found in this committee.</p>
        </div>
      )}
    </div>
  );
}
