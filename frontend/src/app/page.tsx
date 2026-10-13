"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  Play,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Shield,
  GraduationCap,
  HeartHandshake,
} from "lucide-react";
import {
  EventItem,
  HighlightVideo,
  fetchEvents,
  fetchVideos,
  FALLBACK_EVENTS,
  FALLBACK_VIDEOS,
} from "@/lib/api";

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>(FALLBACK_EVENTS);
  const [videos, setVideos] = useState<HighlightVideo[]>(FALLBACK_VIDEOS);
  const [activeVideo, setActiveVideo] = useState<HighlightVideo>(FALLBACK_VIDEOS[0]);

  useEffect(() => {
    async function loadData() {
      const [evs, vids] = await Promise.all([fetchEvents(), fetchVideos()]);
      if (evs.length > 0) setEvents(evs);
      if (vids.length > 0) {
        setVideos(vids);
        setActiveVideo(vids[0]);
      }
    }
    loadData();
  }, []);

  const upcomingThree = events.slice(0, 3);

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-16 pb-20 md:py-24">
        {/* Subtle geometric background accents */}
        <div className="absolute inset-0 bg-radial-[at_top_right] from-slate-100 via-transparent to-transparent opacity-70 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#018BCE]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F3056]/5 border border-[#0F3056]/15 text-[#0F3056] text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#018BCE]" />
                Official Nile University Student Union Portal
              </div>

              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#0F3056] leading-[0.95]">
                One Voice. <br />
                <span className="text-[#018BCE]">Every Student.</span> <br />
                Our Union.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-body">
                Welcome to the central digital home of the <strong>Nile University Student Union (NUSU)</strong>. 
                We represent your voice, champion academic freedom, organize vibrant campus life, and unite our university community.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#0F3056] text-white font-semibold text-sm hover:bg-[#0F548D] transition-all shadow-md shadow-[#0F3056]/15 hover:shadow-lg"
                >
                  <Calendar className="w-4 h-4 text-[#018BCE]" />
                  <span>Explore Upcoming Events</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/board"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-[#0F3056] font-semibold text-sm border border-slate-300/80 hover:bg-slate-50 transition-all shadow-xs"
                >
                  <Users className="w-4 h-4 text-[#0F548D]" />
                  <span>Meet The Board</span>
                </Link>
              </div>

              {/* Key Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                <div>
                  <p className="font-display text-2xl sm:text-3xl text-[#0F3056]">4+</p>
                  <p className="text-xs text-slate-500 font-medium">Core Committees</p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl text-[#018BCE]">3,000+</p>
                  <p className="text-xs text-slate-500 font-medium">Represented Students</p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl text-[#0F3056]">100%</p>
                  <p className="text-xs text-slate-500 font-medium">Student-Governed</p>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Badge */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md relative">
                <div className="w-16 h-16 rounded-2xl bg-[#0F3056] text-white flex flex-col items-center justify-center shadow-lg mb-6">
                  <span className="font-display text-2xl tracking-wider leading-none">NU</span>
                  <span className="text-[10px] font-semibold tracking-widest text-[#018BCE] uppercase leading-none mt-0.5">SU</span>
                </div>

                <h3 className="font-display text-2xl uppercase tracking-wide text-[#0F3056] mb-3">
                  Nile University Student Union
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-body mb-6">
                  The democratic governing body for undergraduate & graduate students at Nile University. Our mission is transparent representation, student welfare advocacy, and unforgettable campus culture.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-medium text-slate-700">
                    <Shield className="w-4 h-4 text-[#018BCE]" />
                    <span>Independent Student Rights & Grievance Advocacy</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-medium text-slate-700">
                    <GraduationCap className="w-4 h-4 text-[#018BCE]" />
                    <span>Academic Curriculum & Peer Mentorship Support</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-medium text-slate-700">
                    <HeartHandshake className="w-4 h-4 text-[#018BCE]" />
                    <span>Campus Traditions, Derbies & Cultural Festivals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Event Highlights & Video Reel Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#018BCE] uppercase font-body">
                <Play className="w-3.5 h-3.5" />
                Campus Media & Direct Reels
              </div>
              <h2 className="font-display text-3xl sm:text-4xl uppercase text-[#0F3056] tracking-tight mt-1">
                Event Highlights & Video Showcase
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              Stream direct video highlights from our annual derbies, spirit weeks, and council initiatives stored securely on NUSU object storage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Primary Video Player */}
            <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
              <div className="aspect-video bg-black relative flex items-center justify-center">
                {activeVideo ? (
                  <video
                    key={activeVideo.id}
                    controls
                    preload="metadata"
                    poster={activeVideo.posterUrl || undefined}
                    className="w-full h-full object-contain"
                  >
                    <source src={activeVideo.videoUrl} type="video/mp4" />
                    Your browser does not support HTML5 video playback.
                  </video>
                ) : (
                  <div className="text-white text-sm">No video selected</div>
                )}
              </div>

              <div className="p-6 sm:p-7 space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#018BCE]/10 text-[#018BCE] text-xs font-bold uppercase tracking-wider">
                  Featured Reel
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-[#0F3056]">
                  {activeVideo?.title || "Union Highlight"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-body">
                  {activeVideo?.description ||
                    "Highlights and memories from the Nile University Student Union calendar."}
                </p>
              </div>
            </div>

            {/* Video Playlist Grid */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase font-body px-1">
                Select Highlight Video ({videos.length})
              </h4>
              <div className="space-y-3">
                {videos.map((vid) => {
                  const isSelected = activeVideo?.id === vid.id;
                  return (
                    <button
                      key={vid.id}
                      onClick={() => setActiveVideo(vid)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-white border-[#018BCE] shadow-sm ring-2 ring-[#018BCE]/20"
                          : "bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? "bg-[#018BCE] text-white" : "bg-[#0F3056]/10 text-[#0F3056]"
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <p
                          className={`text-sm font-semibold truncate ${
                            isSelected ? "text-[#0F3056]" : "text-slate-800"
                          }`}
                        >
                          {vid.title}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {vid.description || "Campus video highlight."}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Upcoming Events Preview (3 Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#018BCE] uppercase font-body">
                <Calendar className="w-3.5 h-3.5" />
                Campus Schedule
              </div>
              <h2 className="font-display text-3xl sm:text-4xl uppercase text-[#0F3056] tracking-tight mt-1">
                Upcoming Campus Events
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F3056] hover:text-[#018BCE] transition-colors"
            >
              <span>View Full Calendar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingThree.map((ev) => {
              const eventDate = new Date(ev.date);
              const day = eventDate.getDate().toString().padStart(2, "0");
              const month = eventDate.toLocaleString("default", { month: "short" }).toUpperCase();
              const year = eventDate.getFullYear();

              return (
                <div
                  key={ev.id}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  <div className="space-y-4">
                    {/* Header badge & date */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="px-3 py-1.5 rounded-xl bg-[#0F3056] text-white text-center">
                        <span className="font-display text-xl leading-none block">{day}</span>
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-[#018BCE] block">
                          {month}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#018BCE]/10 text-[#018BCE]">
                        {ev.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl uppercase tracking-wide text-[#0F3056] group-hover:text-[#018BCE] transition-colors line-clamp-2">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                        {ev.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-[#018BCE] shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-[#018BCE] shrink-0" />
                      <span>{year} • Nile University Campus</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
