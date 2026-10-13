"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Sparkles,
  X,
  CheckCircle2,
  Tag,
} from "lucide-react";
import {
  EventItem,
  fetchEvents,
  FALLBACK_EVENTS,
} from "@/lib/api";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function EventsCalendarPage() {
  const [events, setEvents] = useState<EventItem[]>(FALLBACK_EVENTS);
  const [currentDate, setCurrentDate] = useState(new Date("2026-11-01"));
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedEventModal, setSelectedEventModal] = useState<EventItem | null>(null);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      const data = await fetchEvents();
      if (data && data.length > 0) {
        setEvents(data);
      }
    }
    loadEvents();
  }, []);

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToCurrent = () => {
    setCurrentDate(new Date());
    setSelectedDateStr(null);
  };

  // Group events by YYYY-MM-DD
  const eventsByDate = events.reduce((acc, ev) => {
    const d = new Date(ev.date).toISOString().split("T")[0];
    if (!acc[d]) acc[d] = [];
    acc[d].push(ev);
    return acc;
  }, {} as Record<string, EventItem[]>);

  // Filter feed by selected date if set
  const displayedEvents = selectedDateStr
    ? events.filter(
        (ev) => new Date(ev.date).toISOString().split("T")[0] === selectedDateStr
      )
    : events;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F3056]/5 border border-[#0F3056]/15 text-[#0F3056] text-xs font-semibold tracking-wider uppercase font-body">
          <Sparkles className="w-3.5 h-3.5 text-[#018BCE]" />
          Campus Life & Master Schedule
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#0F3056]">
          Calendar & Upcoming Events
        </h1>
        <p className="text-base text-slate-600 leading-relaxed font-body">
          Explore upcoming academic conferences, student rallies, club festivals, sports tournaments, and townhall debates scheduled across Nile University campus.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Interactive Monthly Calendar Grid */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#018BCE] uppercase">
                Interactive Schedule
              </span>
              <h2 className="font-display text-2xl uppercase tracking-wide text-[#0F3056]">
                {currentDate.toLocaleString("default", { month: "long" })} {year}
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevMonth}
                aria-label="Previous month"
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                aria-label="Next month"
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank leading slots */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`blank-${i}`} className="aspect-square" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(year, month, dayNum);
              const dateStr = dateObj.toISOString().split("T")[0];
              const dayEvents = eventsByDate[dateStr] || [];
              const hasEvents = dayEvents.length > 0;
              const isSelected = selectedDateStr === dateStr;

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => {
                    setSelectedDateStr(isSelected ? null : dateStr);
                  }}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 relative transition-all ${
                    isSelected
                      ? "bg-[#018BCE] text-white font-bold shadow-md shadow-[#018BCE]/25 scale-105"
                      : hasEvents
                      ? "bg-[#0F3056]/5 text-[#0F3056] font-semibold hover:bg-[#0F3056]/15"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-sm">{dayNum}</span>
                  {hasEvents && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                        isSelected ? "bg-white" : "bg-[#018BCE]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {selectedDateStr && (
            <div className="pt-2 flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span>
                Filtered by: <strong>{selectedDateStr}</strong>
              </span>
              <button
                onClick={() => setSelectedDateStr(null)}
                className="font-bold text-[#018BCE] hover:underline"
              >
                Clear Filter
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#018BCE]" />
              <span>Event Scheduled</span>
            </div>
            <button
              onClick={goToCurrent}
              className="text-[#0F3056] hover:text-[#018BCE] font-semibold"
            >
              Reset to Today
            </button>
          </div>
        </div>

        {/* Right Column: Chronological Events Feed */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl uppercase tracking-wide text-[#0F3056]">
              {selectedDateStr ? `Events on ${selectedDateStr}` : "All Scheduled Events"} ({displayedEvents.length})
            </h2>
            {selectedDateStr && (
              <button
                onClick={() => setSelectedDateStr(null)}
                className="text-xs font-semibold text-[#018BCE] hover:underline"
              >
                Show All
              </button>
            )}
          </div>

          <div className="space-y-4">
            {displayedEvents.map((ev) => {
              const eventDate = new Date(ev.date);
              const day = eventDate.getDate().toString().padStart(2, "0");
              const monthName = eventDate.toLocaleString("default", { month: "short" }).toUpperCase();
              const timeStr = eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              return (
                <div
                  key={ev.id}
                  onClick={() => {
                    setSelectedEventModal(ev);
                    setRsvpSuccess(false);
                  }}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
                >
                  <div className="flex items-start sm:items-center gap-5">
                    {/* Anton Numeric Date Badge */}
                    <div className="w-16 h-16 rounded-2xl bg-[#0F3056] text-white flex flex-col items-center justify-center shrink-0 text-center shadow-xs group-hover:bg-[#0F548D] transition-colors">
                      <span className="font-display text-2xl leading-none">{day}</span>
                      <span className="text-[10px] font-bold tracking-widest text-[#018BCE] uppercase mt-0.5">
                        {monthName}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#018BCE]/10 text-[#018BCE]">
                          {ev.category}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {timeStr}
                        </span>
                      </div>

                      <h3 className="font-display text-xl uppercase tracking-wide text-[#0F3056] group-hover:text-[#018BCE] transition-colors leading-snug">
                        {ev.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#018BCE] shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 group-hover:bg-[#0F3056] group-hover:text-white border border-slate-200 group-hover:border-transparent text-xs font-semibold text-slate-700 transition-all">
                      View Details
                    </span>
                  </div>
                </div>
              );
            })}

            {displayedEvents.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3">
                <CalendarIcon className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-base font-semibold text-slate-700">No events scheduled on this date.</p>
                <button
                  onClick={() => setSelectedDateStr(null)}
                  className="text-xs font-bold text-[#018BCE] uppercase tracking-wider hover:underline"
                >
                  Reset Calendar View
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Details Modal / Drawer */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setSelectedEventModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Poster if available */}
            {selectedEventModal.imageUrl && (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src={selectedEventModal.imageUrl}
                  alt={selectedEventModal.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#018BCE]/10 text-[#018BCE]">
                  {selectedEventModal.category}
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  NUSU Campus Event
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-[#0F3056]">
                {selectedEventModal.title}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700">
              <div className="space-y-1">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider">Date & Time</span>
                <p className="font-bold text-slate-800">
                  {new Date(selectedEventModal.date).toLocaleDateString([], {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-slate-500">
                  {new Date(selectedEventModal.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider">Venue</span>
                <p className="font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#018BCE] shrink-0" />
                  {selectedEventModal.location}
                </p>
                <p className="text-slate-500">Nile University, Sheikh Zayed</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                About The Event
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-body">
                {selectedEventModal.description}
              </p>
            </div>

            {/* RSVP / Registration CTA */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              {rsvpSuccess ? (
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>RSVP confirmed! See you at the event.</span>
                </div>
              ) : (
                <button
                  onClick={() => setRsvpSuccess(true)}
                  className="w-full py-3.5 rounded-2xl bg-[#0F3056] text-white font-semibold text-sm hover:bg-[#0F548D] transition-colors shadow-md"
                >
                  Reserve Student Spot / RSVP
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
