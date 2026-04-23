# FaceAttend — Biometric Attendance System (Frontend)

A TypeScript + React + Shadcn UI frontend for the facial recognition attendance management system.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Shadcn UI** (component library)
- **React Router v6** (navigation)
- **Recharts** (analytics charts)
- **face-api.js** (facial recognition — ready to integrate)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
http://localhost:5173
```

## Demo Login

```
Email:    lecturer@university.ac.uk
Password: password
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── AppLayout.tsx      # Sidebar + topbar shell
│   └── ui/                    # All Shadcn UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── dialog.tsx
│       ├── table.tsx
│       ├── alert.tsx
│       ├── separator.tsx
│       └── sidebar.tsx
├── data/
│   └── mockData.ts            # Mock data (replace with API calls)
├── pages/
│   ├── LoginPage.tsx
│   ├── Dashboard.tsx
│   ├── TakeAttendance.tsx
│   ├── AttendanceRecords.tsx
│   ├── Analytics.tsx
│   ├── AtRiskStudents.tsx
│   ├── StudentManagement.tsx
│   ├── ModuleManagement.tsx
│   └── Settings.tsx
├── types/
│   └── index.ts               # All TypeScript interfaces
├── lib/
│   └── utils.ts               # Shadcn cn() utility
├── App.tsx                    # Routing
├── main.tsx                   # Entry point
└── index.css                  # Tailwind + CSS variables (purple theme)
```

## Pages

| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard | Overview stats, modules, recent sessions, at-risk students |
| `/take-attendance` | Take Attendance | Webcam face scanning, live attendance record |
| `/attendance-records` | Attendance Records | Filterable table of all sessions, drill-down view |
| `/analytics` | Analytics & Reports | Line + bar charts, at-risk breakdown |
| `/at-risk-students` | At-Risk Students | Flagged students with risk levels and details |
| `/student-management` | Student Management | Add, search, filter, remove students |
| `/module-management` | Module Management | Create and manage modules |
| `/settings` | Settings | Profile, password, alert preferences |

## Connecting the Backend

All mock data is in `src/data/mockData.ts`. When the backend is ready:

1. Replace mock data imports with API calls (Firebase / REST)
2. Replace `useState(false)` auth in `App.tsx` with Firebase `onAuthStateChanged`
3. Replace `simulateScan()` in `TakeAttendance.tsx` with real `face-api.js` recognition logic

## face-api.js Integration (TakeAttendance.tsx)

The `simulateScan()` function is a placeholder. Replace it with:

```ts
// Load models once on component mount
await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
await faceapi.nets.faceLandmark68Net.loadFromUri('/models')

// Then in your scan loop:
const detection = await faceapi.detectSingleFace(videoRef.current)
  .withFaceLandmarks()
  .withFaceDescriptor()

// Compare descriptor against stored embeddings using FaceMatcher
const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)
const match = faceMatcher.findBestMatch(detection.descriptor)
```
