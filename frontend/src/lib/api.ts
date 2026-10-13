const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  committee: string;
  major?: string | null;
  email?: string | null;
  linkedin?: string | null;
  imageUrl: string;
  bio?: string | null;
  order: number;
  createdAt?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  imageUrl?: string | null;
  createdAt?: string;
}

export interface HighlightVideo {
  id: string;
  title: string;
  description?: string | null;
  videoUrl: string;
  posterUrl?: string | null;
  createdAt?: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface UploadResponse {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
}

// Fallback seed data used if the backend is unreachable during build or initial boot
export const FALLBACK_BOARD_MEMBERS: BoardMember[] = [
  {
    id: "fb-1",
    name: "Youssef El-Masry",
    role: "President",
    committee: "Executive",
    major: "Computer Science",
    imageUrl: "http://localhost:9000/suweb-media/board_president.jpg",
    bio: "Senior Computer Science major dedicated to student representation, campus transparency, and academic excellence at Nile University.",
    email: "president@nusu.edu.eg",
    linkedin: "https://linkedin.com/in/youssef-el-masry",
    order: 1,
  },
  {
    id: "fb-2",
    name: "Nouran Mansour",
    role: "VP of Academic Affairs",
    committee: "Academics",
    major: "Industrial & Service Engineering",
    imageUrl: "http://localhost:9000/suweb-media/board_academics.jpg",
    bio: "Junior Industrial Engineering student advocating for curriculum enhancement, peer-tutoring networks, and undergraduate research opportunities.",
    email: "academics@nusu.edu.eg",
    linkedin: "https://linkedin.com/in/nouran-mansour",
    order: 2,
  },
  {
    id: "fb-3",
    name: "Karim Abdel-Rahman",
    role: "VP of Student Life & Events",
    committee: "Events",
    major: "Business Administration",
    imageUrl: "http://localhost:9000/suweb-media/board_events.jpg",
    bio: "Passionate organizer behind high-energy cultural festivals, university-wide derby championships, and welcoming orientation weeks.",
    email: "events@nusu.edu.eg",
    linkedin: "https://linkedin.com/in/karim-abdelrahman",
    order: 3,
  },
  {
    id: "fb-4",
    name: "Salma Hegazy",
    role: "Director of Media & Communications",
    committee: "Marketing",
    major: "Digital Media & Communication",
    imageUrl: "http://localhost:9000/suweb-media/board_marketing.jpg",
    bio: "Creative multimedia strategist directing NUSU official visual identity, event coverage, and digital student outreach.",
    email: "media@nusu.edu.eg",
    linkedin: "https://linkedin.com/in/salma-hegazy",
    order: 4,
  },
];

export const FALLBACK_EVENTS: EventItem[] = [
  {
    id: "fb-ev-1",
    title: "Nile University Fall Welcome Festival & Carnival",
    description: "Celebrate the start of the semester with live student musical performances, food truck pavilions, student club fair booths, and carnival games.",
    date: "2026-11-05T16:00:00.000Z",
    location: "Main Campus Plaza & Sports Complex",
    category: "Social",
    imageUrl: "http://localhost:9000/suweb-media/event_welcome_carnival.jpg",
  },
  {
    id: "fb-ev-2",
    title: "NU Tech & Innovation Hackathon 2026",
    description: "A 36-hour non-stop challenge bringing together engineers, designers, and innovators to solve real-world problems with top industry mentors.",
    date: "2026-11-20T09:00:00.000Z",
    location: "Innovation Center Lab 3 & Auditorium",
    category: "Academic",
    imageUrl: "http://localhost:9000/suweb-media/event_hackathon.jpg",
  },
  {
    id: "fb-ev-3",
    title: "NUSU Leadership & Alumni Townhall Summit",
    description: "Engage with prominent Nile University alumni, student union delegates, and career mentors in a collaborative campus dialogue.",
    date: "2026-12-02T11:00:00.000Z",
    location: "Grand Conference Hall (Bldg H)",
    category: "Townhall",
    imageUrl: "http://localhost:9000/suweb-media/event_career_summit.jpg",
  },
];

export const FALLBACK_VIDEOS: HighlightVideo[] = [
  {
    id: "fb-vid-1",
    title: "NUSU 2026 Annual Highlights & Year in Review",
    description: "Relive the most memorable milestones, festivals, student representation achievements, and community drives from this academic year.",
    videoUrl: "http://localhost:9000/suweb-media/highlights_2026.mp4",
    posterUrl: "http://localhost:9000/suweb-media/thumb_highlights_2026.jpg",
  },
  {
    id: "fb-vid-2",
    title: "Nile Spirit Week & Campus Derby Aftermovie",
    description: "Experience the electric atmosphere, sporting triumphs, and union pride from the annual Nile University Derby championship.",
    videoUrl: "http://localhost:9000/suweb-media/spirit_week_aftermovie.mp4",
    posterUrl: "http://localhost:9000/suweb-media/thumb_spirit_week.jpg",
  },
];

export async function fetchBoardMembers(): Promise<BoardMember[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/board`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch board members");
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_BOARD_MEMBERS;
  } catch {
    return FALLBACK_BOARD_MEMBERS;
  }
}

export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/events`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch events");
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_EVENTS;
  } catch {
    return FALLBACK_EVENTS;
  }
}

export async function fetchVideos(): Promise<HighlightVideo[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/videos`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch videos");
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_VIDEOS;
  } catch {
    return FALLBACK_VIDEOS;
  }
}

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Invalid credentials.");
  }
  return res.json();
}

export async function uploadFile(file: File, token?: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to upload file to storage.");
  }
  return res.json();
}

export async function createEvent(data: Partial<EventItem>, token?: string): Promise<EventItem> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
}

export async function deleteEvent(id: string, token?: string): Promise<void> {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete event");
}

export async function createBoardMember(data: Partial<BoardMember>, token?: string): Promise<BoardMember> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/board`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create board member");
  return res.json();
}

export async function deleteBoardMember(id: string, token?: string): Promise<void> {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/board/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete board member");
}

export async function createVideo(data: Partial<HighlightVideo>, token?: string): Promise<HighlightVideo> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/videos`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create highlight video");
  return res.json();
}

export async function deleteVideo(id: string, token?: string): Promise<void> {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete video");
}
