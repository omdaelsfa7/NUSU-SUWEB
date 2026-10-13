# Nile University Student Union Portal (SUWEB) - Product Requirements Document (PRD)

## 1. Project Overview & Scope
A modern, responsive full-stack web portal for the **Nile University Student Union (NUSU)** inspired by the clean, card-based aesthetic of `aucsu.org`[cite: 1]. The platform serves as the central digital hub for student union operations, event tracking, leadership visibility, and media distribution.

---

## 2. Core Functional Requirements (Strict 4-Module Scope)

### Module 1: Landing Page (`/`)
- **Hero Section:** Prominent Nile University Student Union (NUSU) branding, mission statement, institutional emblem, and primary calls to action[cite: 1].
- **Event Highlights & Video Reel:** A dedicated responsive video player and showcase reel displaying direct event highlight videos (HTML5 video playback) and recent recaps.
- **Upcoming Events Preview:** A quick-look 3-card preview of the next upcoming campus events with direct links to the full calendar.

### Module 2: Board Member Directory (`/board`)
- **Leadership Grid:** Filterable card directory displaying executive and committee members.
- **Member Profile Cards:**
  - Full Name
  - Role / Position
  - Committee (Executive, Academics, Events, Marketing, HR, etc.)
  - Academic Major
  - Official Email & LinkedIn profiles
  - Profile Image (retrieved directly from MinIO object storage)
  - Brief bio / statement

### Module 3: Calendar & Upcoming Events (`/events`)
- **Interactive Calendar:** A monthly grid interface with visual event markers and active date selection.
- **Upcoming Events Feed:** Chronological list of scheduled campus events detailing:
  - Event title, category badge (Academic, Social, Sports, Townhall), date, and time
  - Campus venue/location
  - Event description and promotional poster/banner
- **Event Details View:** Expanding drawer or modal displaying complete event specifics and RSVP/details.

### Module 4: Admin Control Panel (`/admin`)
- **Central Control Dashboard:** Protected interface allowing union administrators to manage all dynamic portal content:
  - **Events Management:** Full CRUD (create, view, edit, delete) for campus events with poster upload.
  - **Board Management:** Add, update, reorder, and remove union board members with photo uploads.
  - **Video Highlights Management:** Direct raw video file upload (`.mp4`, `.webm`, `.mov`) to MinIO, setting titles, descriptions, and custom poster thumbnails.

---

## 3. Technology Stack & System Architecture

### Frontend (`/frontend`)
- **Framework:** Next.js (App Router, React, TypeScript)
- **Styling:** Tailwind CSS
- **Iconography:** Lucide Icons (`lucide-react`)
- **Utilities:** `clsx`, `tailwind-merge`

### Backend (`/backend`)
- **Framework:** NestJS (REST API architecture)
- **Database ORM:** Prisma ORM
- **Authentication:** JWT & Passport for protected `/admin` endpoints
- **Media Handling:** S3 Client (`@aws-sdk/client-s3` or `minio`) configured for multipart uploads of raw videos and images

### Infrastructure & Database (Root `docker-compose.yml`)
- **Database:** PostgreSQL 16 (Port `5432`, Database: `suweb_db`)
- **Object Storage:** MinIO (API Port `9000`, Web Console Port `9001`, Bucket: `suweb-media`)
- **Execution Strategy:** Local multi-container Docker Compose service

### Version Control (Git & GitHub)
- **Repository:** Monorepo Git repository initialized at the root (`SUWEB`).
- **Ignore Rules:** Root `.gitignore` excluding `node_modules/`, `.next/`, `dist/`, `.env`, and local Docker volume data.
- **Workflow:** Commit cleanly after completing each phase (`feat:`, `chore:`, `fix:`) and push to GitHub using `git` / `gh` CLI when configured.

---

## 4. UI/UX Design System & Official Brand Identity (Nile University Student Union)

- **Institution & Brand Name:** Nile University Student Union (NUSU)[cite: 1]
- **Theme Mode:** Light-mode first (Clean, bright, academic/institutional feel).
- **Official Color Palette:**
  - **Primary Navy (`#0F3056`):** Main structural elements, primary headings, navbar text, and footer surface[cite: 1].
  - **Secondary Blue (`#0F548D`):** Secondary buttons, active states, committee badges, and card accents[cite: 1].
  - **Accent Cyan-Blue (`#018BCE`):** Primary CTA buttons, active calendar markers, highlights, and interactive links[cite: 1].
  - **Contrast Black (`#000000`):** High-contrast typography and icons[cite: 1].
  - **Light Surfaces:** Off-white page background (`#F8FAFC` / `bg-slate-50`) with crisp elevated white cards (`#FFFFFF` / `bg-white border border-slate-200/80 shadow-sm`).
- **Official Typography (Google Fonts):**
  - **Headings / Display Font:** `Anton` (Regular 400) — Use for hero headlines, major section titles, and numeric date badges (`tracking-wide uppercase`)[cite: 1].
  - **Body & UI Font:** `Poppins` (400, 500, 600, 700) — Default font across all cards, descriptions, navigation links, inputs, and buttons[cite: 1].
- **Containers & Geometry:** Smooth, rounded surfaces (`rounded-2xl`, `rounded-3xl`).
- **Prohibited Patterns:** No dark SaaS gradients, glowing neon borders, sci-fi HUDs, or crypto-style counter cards.
- **Navigation Pattern:**
  - **Desktop:** Sticky top navbar featuring the NUSU brand emblem, primary navigation (Home, Board, Events), and Admin button[cite: 1].
  - **Mobile:** Mobile app shell with a sticky bottom navigation tab bar (Home, Board, Events, Admin).

---

## 5. Data Models (Prisma Schema)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model AdminUser {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
}

model BoardMember {
  id        String   @id @default(uuid())
  name      String
  role      String
  committee String
  major     String?
  email     String?
  linkedin  String?
  imageUrl  String   // Public URL in MinIO bucket
  bio       String?
  order     Int      @default(0)
  createdAt DateTime @default(now())
}

model Event {
  id          String   @id @default(uuid())
  title       String
  description String
  date        DateTime
  location    String
  category    String   // Academic, Social, Sports, Townhall
  imageUrl    String?  // Poster stored in MinIO
  createdAt   DateTime @default(now())
}

model HighlightVideo {
  id          String   @id @default(uuid())
  title       String
  description String?
  videoUrl    String   // Direct raw video file URL in MinIO
  posterUrl   String?  // Optional thumbnail image stored in MinIO
  createdAt   DateTime @default(now())
}
```

---

## 6. Phased Implementation Roadmap

1. **Phase 1: Root Infrastructure & Version Control**
   - Configure and run `docker-compose.yml` for PostgreSQL and MinIO.
   - Verify container health and port bindings (`5432`, `9000`, `9001`).
   - Initialize Git repository and root `.gitignore`.

2. **Phase 2: Backend Architecture & Object Storage**
   - Initialize NestJS in `/backend`.
   - Setup Prisma schema, migrations, and database seed script.
   - Implement MinIO service for multipart raw video and image uploads into `suweb-media`.
   - Build CRUD modules for Events, Board, and Videos, and commit changes to Git.

3. **Phase 3: Frontend Scaffolding & NUSU Design System**
   - Initialize Next.js in `/frontend` with `Poppins` and `Anton` fonts and NUSU color tokens (`#0F3056`, `#0F548D`, `#018BCE`, `#000000`)[cite: 1].
   - Build responsive layout (Desktop Navbar + Mobile Bottom Bar).
   - Implement the 4 core views: Landing Page with HTML5 video player, Board Directory, Calendar & Upcoming Events, and Admin Dashboard.

4. **Phase 4: Full-Stack Integration & Testing**
   - Connect frontend API client to NestJS backend endpoints.
   - Wire admin file upload inputs directly to MinIO endpoints.
   - Perform end-to-end smoke testing, commit final build, and push to GitHub.