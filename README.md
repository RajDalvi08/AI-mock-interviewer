🤖 AI Mock Interviewer

An AI-powered mock interview platform built with Next.js 13+ (App Router) that helps users practice technical interviews with realistic, AI-generated questions and structured role-based flows.

Deployed on Vercel 🚀

🧠 Overview

AI Mock Interviewer allows users to:

Select a job role

Choose an experience level

Provide a tech stack

Generate realistic AI-driven interview questions instantly

The platform simulates structured interviews using a modern full-stack architecture powered by Next.js App Router and API routes.

✨ Features

🔐 Authentication (Sign In / Sign Up)

🎤 AI-powered interview question generation

🧩 Role-based dynamic interview flow

⚡ Next.js 13+ App Router architecture

🧪 API Routes using route.ts

🎨 Modern UI with global styling

☁️ Fully deployed on Vercel

📦 TypeScript support

📁 Clean folder structure using route groups

🛠️ Tech Stack
Frontend

Next.js 13+ (App Router)

React

TypeScript

CSS / Global Styling

Backend

Next.js API Routes (route.ts)

Server-side request handling

AI Integration

Vapi AI (for interview question generation)

Authentication

Custom Auth / Firebase / JWT (based on implementation)

Deployment

Vercel

🗂️ Project Structure
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

⚙️ API Usage
Generate AI Interview

Endpoint

POST /api/vapi/generate

Request Body
{
  "role": "Frontend Developer",
  "level": "Junior",
  "techStack": ["React", "JavaScript"]
}

Response
{
  "success": true,
  "questions": [
    "Explain the virtual DOM in React.",
    "What is a closure in JavaScript?"
  ]
}

🧪 Run Locally
1️⃣ Clone the repository
git clone https://github.com/RajDalvi08/AI-mock-interviewer.git
cd AI-mock-interviewer/my-app

2️⃣ Install dependencies
npm install

3️⃣ Add environment variables

Create a .env.local file in my-app/:

VAPI_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000


(Add authentication keys if required)

4️⃣ Start development server
npm run dev


App runs at:

http://localhost:3000


API available at:

http://localhost:3000/api/vapi/generate

🚀 Deployment

This project is deployed using Vercel.

Deployment Steps

Push code to GitHub

Import repository into Vercel

Add required environment variables

Deploy 🎉

🧯 Common Issues & Fixes
❌ 404 on API route

Make sure your API file path is:

app/api/vapi/generate/route.ts


Also verify:

Folder naming is correct

You're using App Router (not Pages Router)

❌ Authentication Redirect Loop

Check:

isAuthenticated() logic in layout.tsx

Middleware configuration

Token/session validation

📌 Future Improvements

🎯 AI-based interview feedback & scoring

📄 Resume-based interview generation

🎙️ Voice / Audio interview mode

🛠️ Admin dashboard



👨‍💻 Author

Raj Dalvi
GitHub: https://github.com/RajDalvi08

📄 License

This project is licensed under the MIT License.
