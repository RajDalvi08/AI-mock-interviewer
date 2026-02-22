# 🤖 **AI MOCK INTERVIEWER**

An **AI-powered mock interview platform** built using **Next.js 13+ (App Router)** that helps users practice technical interviews with **realistic, AI-generated questions and structured role-based flows**.

🚀 **Live & Deployed on Vercel**

---

## 🧠 **PROJECT OVERVIEW**

**AI Mock Interviewer** is designed to simulate real interview environments where users can:

* 🎯 Select a **job role**
* 📊 Choose an **experience level**
* 🧰 Provide their **tech stack**
* 🤖 Instantly generate **AI-driven interview questions**

The platform delivers a **structured and dynamic interview experience** using modern full-stack architecture.

---

## ✨ **FEATURES**

* 🔐 **Authentication System** (Sign In / Sign Up)
* 🎤 **AI-powered Interview Question Generation**
* 🧩 **Role-based Dynamic Interview Flow**
* ⚡ **Next.js 13+ App Router Architecture**
* 🧪 **API Routes using `route.ts`**
* 🎨 **Modern UI with Global Styling**
* ☁️ **Fully Deployed on Vercel**
* 📦 **TypeScript Support**
* 📁 **Scalable Folder Structure using Route Groups**

---

## 🛠️ **TECH STACK**

### 💻 **Frontend**

* **Next.js 13+ (App Router)**
* **React.js**
* **TypeScript**
* **CSS / Global Styling**

### ⚙️ **Backend**

* **Next.js API Routes (`route.ts`)**
* **Server-side Request Handling**

### 🤖 **AI INTEGRATION**

* **Vapi AI** for generating interview questions dynamically

### 🔐 **AUTHENTICATION**

* Custom Auth / Firebase / JWT *(based on implementation)*

### 🚀 **DEPLOYMENT**

* **Vercel**

---

## 📂 **PROJECT STRUCTURE**

```id="az3l9s"
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
│   │
│   └── layout.tsx
│
├── types/
├── public/
├── package.json
└── README.md
```

---

## ⚙️ **API USAGE**

### 🤖 **Generate AI Interview Questions**

**Endpoint**

```id="1sjzkg"
POST /api/vapi/generate
```

**Request Body**

```json id="s8f8gl"
{
  "role": "Frontend Developer",
  "level": "Junior",
  "techStack": ["React", "JavaScript"]
}
```

**Response**

```json id="mrd7wr"
{
  "success": true,
  "questions": [
    "Explain the virtual DOM in React.",
    "What is a closure in JavaScript?"
  ]
}
```

---

## 🧪 **RUN LOCALLY**

### 1️⃣ Clone the Repository

```bash id="p2v9lq"
git clone https://github.com/RajDalvi08/AI-mock-interviewer.git
```

### 2️⃣ Navigate to Project

```bash id="u9s2ka"
cd AI-mock-interviewer/my-app
```

### 3️⃣ Install Dependencies

```bash id="h4p8je"
npm install
```

### 4️⃣ Setup Environment Variables

Create a `.env.local` file inside `my-app/`:

```env id="a0m2xe"
VAPI_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

👉 Add authentication keys if required

---

### 5️⃣ Start Development Server

```bash id="j3w8zt"
npm run dev
```

---

### 🌐 **App Runs At**

```id="b4d1rk"
http://localhost:3000
```

### 🔗 **API Endpoint**

```id="t8s9nm"
http://localhost:3000/api/vapi/generate
```

---

## 🚀 **DEPLOYMENT (VERCEL)**

This project is fully deployed using **Vercel**.

### 📌 Steps:

1. Push code to GitHub
2. Import repository into Vercel
3. Add environment variables
4. Deploy 🎉

---

## 🧯 **COMMON ISSUES & FIXES**

### ❌ **404 on API Route**

✔ Ensure correct file path:

```id="z7q3lm"
app/api/vapi/generate/route.ts
```

✔ Verify:

* Correct folder naming
* Using **App Router (not Pages Router)**

---

### ❌ **Authentication Redirect Loop**

✔ Check:

* `isAuthenticated()` logic in `layout.tsx`
* Middleware configuration
* Token/session validation

---

## 🎯 **FUTURE ENHANCEMENTS**

* 🎯 AI-based **Interview Feedback & Scoring System**
* 📄 Resume-based Interview Generation
* 🎙️ Voice / Audio Interview Mode
* 🛠️ Admin Dashboard
* 📊 Performance Analytics

---

## 🏆 **KEY HIGHLIGHTS (FOR PORTFOLIO)**

* ✅ Full-stack **Next.js App Router implementation**
* ✅ Real-world **AI integration**
* ✅ Clean and scalable **folder architecture**
* ✅ Production-ready deployment on **Vercel**
* ✅ Strong use of **TypeScript + API design**

---

## 👨‍💻 **AUTHOR**

**Raj Dalvi**
🔗 GitHub: https://github.com/RajDalvi08

---

## 📄 **LICENSE**

This project is licensed under the **MIT License**.

---

💡 **Note:** This project stands out as a **real-world AI + full-stack application**, showcasing skills in **system design, API development, and modern frontend architecture**, making it highly valuable for internships and developer roles.

