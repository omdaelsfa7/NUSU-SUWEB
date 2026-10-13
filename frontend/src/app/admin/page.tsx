"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Calendar,
  Users,
  Video,
  LogOut,
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import {
  EventItem,
  BoardMember,
  HighlightVideo,
  fetchEvents,
  fetchBoardMembers,
  fetchVideos,
  loginAdmin,
  uploadFile,
  createEvent,
  deleteEvent,
  createBoardMember,
  deleteBoardMember,
  createVideo,
  deleteVideo,
} from "@/lib/api";

type TabType = "events" | "board" | "videos";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("admin@nusu.edu.eg");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<TabType>("events");

  // Data state
  const [events, setEvents] = useState<EventItem[]>([]);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [videos, setVideos] = useState<HighlightVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Forms state
  // Event form
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventCategory, setNewEventCategory] = useState("Social");
  const [eventFile, setEventFile] = useState<File | null>(null);
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

  // Board form
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [newMemberCommittee, setNewMemberCommittee] = useState("Executive");
  const [newMemberMajor, setNewMemberMajor] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberLinkedin, setNewMemberLinkedin] = useState("");
  const [newMemberBio, setNewMemberBio] = useState("");
  const [newMemberOrder, setNewMemberOrder] = useState(1);
  const [boardFile, setBoardFile] = useState<File | null>(null);
  const [isSubmittingBoard, setIsSubmittingBoard] = useState(false);

  // Video form
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoDesc, setNewVideoDesc] = useState("");
  const [rawVideoFile, setRawVideoFile] = useState<File | null>(null);
  const [videoPosterFile, setVideoPosterFile] = useState<File | null>(null);
  const [isSubmittingVideo, setIsSubmittingVideo] = useState(false);

  // Load token on mount safely
  useEffect(() => {
    const savedToken = localStorage.getItem("nusu_admin_token");
    const savedUser = localStorage.getItem("nusu_admin_user");
    if (savedToken) {
      setTimeout(() => {
        setToken(savedToken);
        if (savedUser) setAdminUser(JSON.parse(savedUser));
      }, 0);
    }
  }, []);

  // Fetch data when token is present
  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  async function loadAllData() {
    setLoading(true);
    try {
      const [evs, bds, vds] = await Promise.all([
        fetchEvents(),
        fetchBoardMembers(),
        fetchVideos(),
      ]);
      setEvents(evs);
      setBoardMembers(bds);
      setVideos(vds);
    } catch {
      setActionMessage({ type: "error", text: "Failed to reload updated data from server." });
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const res = await loginAdmin(loginEmail, loginPassword);
      setToken(res.access_token);
      setAdminUser(res.user);
      localStorage.setItem("nusu_admin_token", res.access_token);
      localStorage.setItem("nusu_admin_user", JSON.stringify(res.user));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid credentials.";
      setLoginError(message);
    } finally {
      setIsLoggingIn(false);
    }
  }

  function handleLogout() {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem("nusu_admin_token");
    localStorage.removeItem("nusu_admin_user");
  }

  // --- Handlers for Event ---
  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setIsSubmittingEvent(true);
    setActionMessage(null);

    try {
      let imageUrl: string | undefined = undefined;
      if (eventFile) {
        const uploadRes = await uploadFile(eventFile, token);
        imageUrl = uploadRes.url;
      }

      await createEvent(
        {
          title: newEventTitle,
          description: newEventDesc,
          date: new Date(newEventDate).toISOString(),
          location: newEventLocation,
          category: newEventCategory,
          imageUrl,
        },
        token
      );

      setActionMessage({ type: "success", text: "Event created and published successfully!" });
      setNewEventTitle("");
      setNewEventDesc("");
      setNewEventDate("");
      setNewEventLocation("");
      setEventFile(null);
      await loadAllData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create event.";
      setActionMessage({ type: "error", text: message });
    } finally {
      setIsSubmittingEvent(false);
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!token || !confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id, token);
      setActionMessage({ type: "success", text: "Event deleted successfully." });
      await loadAllData();
    } catch {
      setActionMessage({ type: "error", text: "Failed to delete event." });
    }
  }

  // --- Handlers for Board ---
  async function handleCreateBoard(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setIsSubmittingBoard(true);
    setActionMessage(null);

    try {
      let imageUrl: string = "http://localhost:9000/suweb-media/default-avatar.png";
      if (boardFile) {
        const uploadRes = await uploadFile(boardFile, token);
        imageUrl = uploadRes.url;
      }

      await createBoardMember(
        {
          name: newMemberName,
          role: newMemberRole,
          committee: newMemberCommittee,
          major: newMemberMajor,
          email: newMemberEmail,
          linkedin: newMemberLinkedin,
          bio: newMemberBio,
          order: Number(newMemberOrder),
          imageUrl,
        },
        token
      );

      setActionMessage({ type: "success", text: "Board member added successfully!" });
      setNewMemberName("");
      setNewMemberRole("");
      setNewMemberMajor("");
      setNewMemberEmail("");
      setNewMemberLinkedin("");
      setNewMemberBio("");
      setBoardFile(null);
      await loadAllData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add board member.";
      setActionMessage({ type: "error", text: message });
    } finally {
      setIsSubmittingBoard(false);
    }
  }

  async function handleDeleteBoard(id: string) {
    if (!token || !confirm("Are you sure you want to remove this board member?")) return;
    try {
      await deleteBoardMember(id, token);
      setActionMessage({ type: "success", text: "Board member removed successfully." });
      await loadAllData();
    } catch {
      setActionMessage({ type: "error", text: "Failed to delete board member." });
    }
  }

  // --- Handlers for Videos ---
  async function handleCreateVideo(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !rawVideoFile) {
      setActionMessage({ type: "error", text: "Please select a raw video file to upload." });
      return;
    }
    setIsSubmittingVideo(true);
    setActionMessage(null);

    try {
      // 1. Upload video to MinIO
      const videoRes = await uploadFile(rawVideoFile, token);

      // 2. Upload optional thumbnail
      let posterUrl: string | undefined = undefined;
      if (videoPosterFile) {
        const posterRes = await uploadFile(videoPosterFile, token);
        posterUrl = posterRes.url;
      }

      // 3. Save HighlightVideo record in backend
      await createVideo(
        {
          title: newVideoTitle,
          description: newVideoDesc,
          videoUrl: videoRes.url,
          posterUrl,
        },
        token
      );

      setActionMessage({ type: "success", text: "Video highlight uploaded to MinIO and saved!" });
      setNewVideoTitle("");
      setNewVideoDesc("");
      setRawVideoFile(null);
      setVideoPosterFile(null);
      await loadAllData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload video.";
      setActionMessage({ type: "error", text: message });
    } finally {
      setIsSubmittingVideo(false);
    }
  }

  async function handleDeleteVideo(id: string) {
    if (!token || !confirm("Are you sure you want to delete this highlight video?")) return;
    try {
      await deleteVideo(id, token);
      setActionMessage({ type: "success", text: "Highlight video deleted successfully." });
      await loadAllData();
    } catch {
      setActionMessage({ type: "error", text: "Failed to delete video." });
    }
  }

  // If not logged in -> Display Admin Login Gate
  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 sm:py-28">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#0F3056] text-white mx-auto flex items-center justify-center shadow-md">
              <Lock className="w-6 h-6 text-[#018BCE]" />
            </div>
            <h1 className="font-display text-3xl uppercase tracking-wide text-[#0F3056]">
              NUSU Admin Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Enter authorized administrator credentials to manage portal content.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Official Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@nusu.edu.eg"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-[#0F3056] text-white font-semibold text-sm hover:bg-[#0F548D] transition-colors shadow-md disabled:opacity-50"
            >
              {isLoggingIn ? "Authenticating..." : "Sign In to Admin Portal"}
            </button>
          </form>

          {/* Dev Helper */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-[#0F3056] block">Default Admin Credentials:</span>
            <p>Email: <code className="text-[#018BCE]">admin@nusu.edu.eg</code></p>
            <p>Password: <code className="text-[#018BCE]">admin123</code></p>
          </div>
        </div>
      </div>
    );
  }

  // Logged In: Tabbed Admin Control Panel
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0F3056] text-white flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[#018BCE]" />
          </div>
          <div>
            <h1 className="font-display text-2xl uppercase tracking-wide text-[#0F3056]">
              NUSU Content Management Control Panel
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Signed in as <strong>{adminUser?.email || "Admin"}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors self-start sm:self-center"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-medium flex items-center justify-between gap-2 ${
            actionMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab("events")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "events"
              ? "bg-[#0F3056] text-white shadow-md shadow-[#0F3056]/20"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Events Management ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("board")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "board"
              ? "bg-[#0F3056] text-white shadow-md shadow-[#0F3056]/20"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Board Members ({boardMembers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("videos")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "videos"
              ? "bg-[#0F3056] text-white shadow-md shadow-[#0F3056]/20"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Video Reels ({videos.length})</span>
        </button>
      </div>

      {/* TAB 1: EVENTS */}
      {activeTab === "events" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Event Form */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <h2 className="font-display text-xl uppercase tracking-wide text-[#0F3056] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#018BCE]" />
              Create Campus Event
            </h2>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">Event Title</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Annual Fall Welcome Festival"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">Description</label>
                <textarea
                  required
                  rows={3}
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="Describe event details, agenda, and guidelines..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-600">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-600">Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                  >
                    <option value="Social">Social</option>
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Townhall">Townhall</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">Campus Location</label>
                <input
                  type="text"
                  required
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  placeholder="e.g. Main Campus Plaza & Sports Complex"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Promotional Poster (Uploaded to MinIO)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEventFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0F3056]/10 file:text-[#0F3056] hover:file:bg-[#0F3056]/20"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingEvent}
                className="w-full py-3 rounded-xl bg-[#0F3056] text-white font-semibold text-sm hover:bg-[#0F548D] transition-colors shadow-md disabled:opacity-50"
              >
                {isSubmittingEvent ? "Uploading & Saving..." : "Publish Event"}
              </button>
            </form>
          </div>

          {/* List Events */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <h2 className="font-display text-xl uppercase tracking-wide text-[#0F3056]">
              Active Events ({events.length})
            </h2>

            <div className="space-y-3">
              {events.map((ev: EventItem) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#018BCE]/10 text-[#018BCE]">
                      {ev.category}
                    </span>
                    <h3 className="font-bold text-sm text-[#0F3056]">{ev.title}</h3>
                    <p className="text-xs text-slate-500">
                      {new Date(ev.date).toLocaleDateString()} • {ev.location}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {events.length === 0 && !loading && (
                <p className="text-sm text-slate-500 py-6 text-center">No events found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOARD MEMBERS */}
      {activeTab === "board" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Board Member Form */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <h2 className="font-display text-xl uppercase tracking-wide text-[#0F3056] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#018BCE]" />
              Add Board Member
            </h2>

            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-600">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g. Youssef El-Masry"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-600">Position / Role</label>
                  <input
                    type="text"
                    required
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    placeholder="e.g. President"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-600">Committee</label>
                  <select
                    value={newMemberCommittee}
                    onChange={(e) => setNewMemberCommittee(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                  >
                    <option value="Executive">Executive</option>
                    <option value="Academics">Academics</option>
                    <option value="Events">Events</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-600">Display Order</label>
                  <input
                    type="number"
                    value={newMemberOrder}
                    onChange={(e) => setNewMemberOrder(Number(e.target.value))}
                    min={1}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">Academic Major</label>
                <input
                  type="text"
                  value={newMemberMajor}
                  onChange={(e) => setNewMemberMajor(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-600">Email</label>
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="president@nusu.edu.eg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-600">LinkedIn URL</label>
                  <input
                    type="url"
                    value={newMemberLinkedin}
                    onChange={(e) => setNewMemberLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">Bio Statement</label>
                <textarea
                  rows={2}
                  value={newMemberBio}
                  onChange={(e) => setNewMemberBio(e.target.value)}
                  placeholder="Brief summary of member's platform and advocacy..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Profile Photo (Uploaded to MinIO)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBoardFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0F3056]/10 file:text-[#0F3056] hover:file:bg-[#0F3056]/20"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingBoard}
                className="w-full py-3 rounded-xl bg-[#0F3056] text-white font-semibold text-sm hover:bg-[#0F548D] transition-colors shadow-md disabled:opacity-50"
              >
                {isSubmittingBoard ? "Uploading & Saving..." : "Add Board Member"}
              </button>
            </form>
          </div>

          {/* List Members */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <h2 className="font-display text-xl uppercase tracking-wide text-[#0F3056]">
              Current Board Members ({boardMembers.length})
            </h2>

            <div className="space-y-3">
              {boardMembers.map((member: BoardMember) => (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {member.committee} • #{member.order}
                    </span>
                    <h3 className="font-bold text-sm text-[#0F3056]">{member.name}</h3>
                    <p className="text-xs text-[#018BCE] font-semibold">{member.role}</p>
                    {member.major && <p className="text-[11px] text-slate-500">{member.major}</p>}
                  </div>

                  <button
                    onClick={() => handleDeleteBoard(member.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                    title="Remove Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {boardMembers.length === 0 && !loading && (
                <p className="text-sm text-slate-500 py-6 text-center">No board members found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VIDEOS */}
      {activeTab === "videos" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct Raw Video Upload Form */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <h2 className="font-display text-xl uppercase tracking-wide text-[#0F3056] flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#018BCE]" />
              Upload Highlight Video to MinIO
            </h2>

            <form onSubmit={handleCreateVideo} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">Video Title</label>
                <input
                  type="text"
                  required
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="e.g. Spirit Week & Derby Aftermovie"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">Description</label>
                <textarea
                  rows={2}
                  value={newVideoDesc}
                  onChange={(e) => setNewVideoDesc(e.target.value)}
                  placeholder="Brief synopsis of the highlight reel..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#018BCE]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Raw Video File (.mp4, .webm, .mov)
                </label>
                <input
                  type="file"
                  required
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={(e) => setRawVideoFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#018BCE]/10 file:text-[#018BCE] hover:file:bg-[#018BCE]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">
                  Optional Poster Thumbnail (.jpg, .png, .webp)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setVideoPosterFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingVideo}
                className="w-full py-3 rounded-xl bg-[#0F3056] text-white font-semibold text-sm hover:bg-[#0F548D] transition-colors shadow-md disabled:opacity-50"
              >
                {isSubmittingVideo ? "Streaming directly to MinIO..." : "Upload Highlight Video"}
              </button>
            </form>
          </div>

          {/* List Videos */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <h2 className="font-display text-xl uppercase tracking-wide text-[#0F3056]">
              Uploaded Video Reels ({videos.length})
            </h2>

            <div className="space-y-3">
              {videos.map((vid: HighlightVideo) => (
                <div
                  key={vid.id}
                  className="p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1 overflow-hidden">
                    <h3 className="font-bold text-sm text-[#0F3056] truncate">{vid.title}</h3>
                    <p className="text-xs text-slate-500 truncate">{vid.description || "Video highlight"}</p>
                    <p className="text-[10px] text-[#018BCE] truncate">{vid.videoUrl}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteVideo(vid.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {videos.length === 0 && !loading && (
                <p className="text-sm text-slate-500 py-6 text-center">No video reels uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
