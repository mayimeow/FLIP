# F.L.I.P. (Fun Logic Interactive Platform) 🎮⚡

F.L.I.P. is a gamified, interactive educational platform designed for Computer Engineering students to master digital logic design. Moving beyond static textbooks, F.L.I.P. provides a hands-on, "Hardware-in-the-Loop" style learning experience combined with competitive arena mechanics.

## ✨ Key Features

* **Interactive Study Hub:** 16+ custom-built logic modules ranging from basic Boolean algebra (De Morgan's Laws, K-Maps) to advanced sequential logic (Half/Full Adders, Multiplexers, SR/JK/D/T Flip-Flops).
* **The Sandbox Canvas:** A free-form circuit builder that challenges students to route primitive gates (AND, OR) to construct complex components like a 2-to-1 MUX from scratch.
* **Waveform Analyzer:** A real-time, SVG-based oscilloscope that visualizes Clock (CLK), Data (D), and Output (Q) states to teach edge-triggered memory.
* **Skill Tree Progression:** Advanced learning modules are locked behind an XP requirement, ensuring foundational mastery before progressing.
* **The Quiz Arena:** A high-stakes testing environment featuring dynamic UI feedback and an Escalating Penalty System (1m ➜ 5m ➜ 15m lockouts) to prevent brute-force guessing.
* **Global Leaderboard:** Real-time XP tracking and ranking across the platform, complete with unlockable character avatars.
* **Admin BI Dashboard:** A simulated Business Intelligence interface tracking global accuracy, average answer times, and highlighting curriculum bottlenecks.

## 🛠 Tech Stack

* **Frontend:** React.js, Vite
* **Styling:** Tailwind CSS (Mobile-First, Gamified UI)
* **Backend & Auth:** Firebase Auth, Firestore Database
* **Icons:** Lucide React
* **Routing:** React Router DOM
* **Deployment:** Vercel

## 🚀 Getting Started

### Installation

1. **Clone the repository:**
   git clone https://github.com/mayimeow/FLIP.git
   cd FLIP

2. **Install dependencies:**
   npm install

3. **Start the development server:**
   npm run dev

## 📂 Project Structure
* `/src/pages/` - Core routing views (Dashboard, Auth, QuizArena, LearningHub, etc.)
* `/src/components/LearningModules.jsx` - The core physics and logic engine containing all interactive circuit components.
* `/src/firebase.js` - Database and Authentication initialization.