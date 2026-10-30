# Chat Application & Creative Landing Page

A responsive web application featuring a real-time messaging client and a modern landing page built with Next.js, TypeScript, and Tailwind CSS.

---

## Live Demos & Repository

- **Part 1 (Chat Application):** `https://chat-app-eta-wine-69.vercel.app/chat`
- **Part 2 (Creative Landing Page):** `https://chat-app-eta-wine-69.vercel.app`

---

## Tech Stack

- **Frontend Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Real-Time Engine:** Socket.io-client
- **State Management:** React Hooks & Context API
- **Icons:** Lucide React

---

## Setup & Installation Instructions

Follow these steps to run the project locally on your machine:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Sawom/chat-app.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000` to see the application running.

---

## Architectural Write-Up & Summary

### 1. Architecture & Design Choices

#### Part 1: Chat Application

- **Next.js & TypeScript:** Selected Next.js App Router for fast page loads and simple file routing. TypeScript was used to avoid runtime bugs when handling complex socket events.
- **Tailwind CSS:** Used for writing quick, clean, and fully responsive styles.
- **React Context & Socket.io:** Managed global state with lightweight React Context instead of heavy Redux, pairing it with Socket.io-client for fast live updates.

#### Part 2: Creative Landing Page

- Designed with modern visual hierarchy, contrast, smooth cards, and clear call-to-action (CTA) buttons. The mobile-first layout ensures it scales cleanly on all device screens.

---

### 2. How I used AI Tools

- **Tool Used:** Gemini (AI Assistant)
- **What it was used for:**
  - Fixing grammatical mistakes in written texts and comments.
  - Formatting clean Markdown files (API Documentation and README).
  - Helping debug build errors quickly during the development step and Vercel deployment step.
- **What I wrote and managed myself:**
  - Core application state logic and custom React hooks.
  - Writing manual data-matching fixes when the API returned unexpected data formats.
  - Creating the full dynamic layout, sidebar logic, and responsive screen switching for mobile devices.

---

### 3. Challenges & Issues Faced

- **API Response Shape Mismatch ('Chat' Name Bug):** The sidebar and active header were showing `'Chat'` instead of the actual user name. After checking the raw response in the console, I noticed direct chats were returning a single `participant` object instead of a `participants` array. I fixed this by adding fallback logic (`conv.participant?.name || conv.participants?.find(...)`).
- **Recent Chat Re-ordering:** Sorting conversations so that the latest message always moves the active chat to the top of the sidebar list required extra state handling when receiving new socket events.
- **Group Creation Hassles:** Managing selected user IDs, validation, dynamic admin tags, and syncing backend payload shapes during group setup took extra care and logic.
- **Mobile Layout & UI/UX Improvements:** The mobile screen initially suffered from blocked views when clicking chats. I improved the UI/UX by adding conditional mobile sidebar toggling and clean navigation transitions.
- **TypeScript Build Errors:** Met type errors during production deployment for vercel (`type`, `groupAdmins`, `participant` missing in interfaces). Resolved this by updating the central TypeScript definitions with optional properties.

---

### 4. Future Improvements (With More Time)

- Add optimistic UI updates so sent messages appear instantly before socket acknowledgement.
- Add rich typing status indicators, image/file attachments, and read receipts.

#### Note: The backend is hosted on Render's free tier, which may experience cold start delays on initial connection.
