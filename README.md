
🤖 AI Mock Interviewer
An AI-powered mock interview platform built with Next.js (App Router) that helps users practice interviews with realistic AI-driven questions and responses.
Deployed on Vercel 🚀

/api/vapi/generate
🧠 Features
🔐 Authentication (Sign In / Sign Up)
🎤 AI-powered interview generation
🧩 Role-based interview flow
⚡ App Router (Next.js 13+)
🧪 API routes using route.ts
🎨 Modern UI with global styles
☁️ Fully deployed on Vercel
🗂️ Project Structure
Copy code

my-app/
│
├── app/
│   ├── api/
│   │   └── vapi/
│   │       └── generate/
│   │           └── route.ts
│   │
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   ├── sign-up/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (root)/
│   │   ├── interview/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   └── page.tsx
│   │
│   ├── globals.css
│   └── layout.tsx
│
├── types/
├── public/
├── package.json
└── README.md
🛠️ Tech Stack
Frontend: Next.js 13+ (App Router), React, TypeScript
Backend: Next.js API Routes (route.ts)
AI: Vapi AI
Auth: Custom / Firebase / JWT (based on implementation)
Deployment: Vercel
⚙️ API Usage
Generate AI Interview
Endpoint
Copy code

POST /api/vapi/generate
Request Body (example):
Copy code
Json
{
  "role": "Frontend Developer",
  "level": "Junior",
  "techStack": ["React", "JavaScript"]
}
Response:
Copy code
Json
{
  "success": true,
  "questions": [
    "Explain the virtual DOM in React.",
    "What is a closure in JavaScript?"
  ]
}
🧪 Run Locally
1️⃣ Clone the repo
Copy code
Bash
git clone https://github.com/RajDalvi08/AI-mock-interviewer.git
cd AI-mock-interviewer/my-app
2️⃣ Install dependencies
Copy code
Bash
npm install

4️⃣ Start the dev server
Copy code
Bash
npm run dev
App will run at:
Copy code

http://localhost:3000
API available at:
Copy code

http://localhost:3000/api/vapi/generate
🚀 Deployment
This project is deployed using Vercel.
Steps:
Push code to GitHub
Import repo into Vercel
Add environment variables
Deploy 🎉
🧯 Common Issues
❌ 404 on API route
👉 Make sure the API path is:
Copy code

app/api/vapi/generate/route.ts
❌ Auth redirect loop
👉 Check isAuthenticated() logic in layout.tsx
📌 Future Improvements
Interview feedback & scoring
Resume-based interview generation
Audio / voice interview mode
Admin dashboard
Interview history & analytics
