# The Grand Unveil

Build a stunning, fully responsive, interactive 3D animated wedding website. 

### 1. Visual & Tech Stack Requirements
- Modern, luxury aesthetic: Soft romantic palette (cream, warm ivory, soft sage green, blush pink, and subtle champagne gold accents).
- Smooth 3D graphics and micro-interactions using Three.js / React Three Fiber / Lucide icons / Framer Motion.
- Mobile-First Design: Ensure identical, smooth 60fps 3D performance and layout responsiveness on mobile browsers (iOS/Android) as well as desktop.

### 2. Website Sections & Flow

#### A. Interactive Landing / Entry Experience (The Grand Unveil)
- Screen opens on a cinematic sealed invitation envelope or a glowing 3D wax seal centered on screen, surrounded by subtle floating 3D floral petals / sparkles in the background.
- Floating instruction prompt: "Tap to Open Invitation".
- Interaction: Clicking/tapping the seal triggers a realistic 3D envelope-opening or curtain-unveil animation with smooth camera zoom, transitioning into the main event page.

#### B. Hero Section (Post-Unveil)
- Dynamic 3D background with floating glassmorphism cards and delicate 3D floating hearts or petals that react slightly to mouse movements/device tilt (gyroscope-enabled for mobile).
- Bold typography featuring the couple's names (e.g., "Alex & Sophia") with elegant script fonts and event date.
- Animated countdown timer to the wedding date.

#### C. Story / Memory Lane Timeline
- Interactive vertical timeline showing how they met, the proposal, and key relationship milestones.
- Cards animate gracefully into view on scroll using Framer Motion (fade-up, tilt effects).

#### D. Event Details & Location
- Interactive schedule cards for Ceremony, Reception, and After Party.
- Integrated Google Maps preview card with a custom styled pin for venue directions.

#### E. RSVP Section
- Clean interactive RSVP form (Name, Attendance status, Number of Guests, Dietary requirements).
- On submission, trigger a 3D celebration confetti/sparkle particle burst.

### 3. Performance & Mobile Optimizations
- Ensure light lighting setups in Three.js so 3D renders fluidly without lag on mobile devices.
- Touch-friendly tap targets and smooth touch-drag controls for all interactive elements.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c3717df3-ef90-4f62-8f64-b3303dbb742f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
