# Secure Todo App — Next.js + Strapi

### A minimalist, production-ready Task Management System with advanced JWT Authorization and Secure Backend Ownership.

---

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Strapi](https://img.shields.io/badge/Strapi-2F2E8B?style=for-the-badge&logo=strapi&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT Auth](https://img.shields.io/badge/JWT_Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)

---

## 📖 Project Overview

The **Secure Todo App** is a full-stack productivity tool engineered with a focus on **security, minimalism, and performance**. Unlike basic todo apps, this system implements a rigorous backend ownership validation layer and modern Next.js 15 architectures.

Users can securely register and manage their private tasks through a modern dashboard. The application leverages **Next.js Server Actions** for secure authentication and **Server-Side Rendering (SSR)** for instantaneous data availability upon login.

### Key Highlights:
- **Next.js Server Actions:** Secure, server-side form handling for login and registration.
- **SSR Initial Data:** Instant dashboard population without loading flickers via Server-Side Rendering.
- **True Backend Ownership:** Every task is cryptographically linked to its creator via JWT.
- **Minimalist Aesthetic:** A distraction-free UI using the `zinc` color palette.

---

## ✨ Features

- **🔐 Server-Side Authentication:** Uses **Next.js Server Actions** to securely manage credentials and JWT cookies.
- **🚀 SSR Data Fetching:** Dashboard tasks are fetched on the server, ensuring zero-latency initial renders.
- **🛡️ Protected Routes:** Next.js Middleware ensures the `/dashboard` is inaccessible to unauthenticated users.
- **💾 Persistent Sessions:** JWT tokens are stored in secure cookies, allowing users to stay logged in.
- **⚡ Real-time CRUD:** Create, Read, Update (Toggle), and Delete todos with immediate UI feedback.
- **🔒 Backend Validation:** Custom Strapi controllers automatically assign todos to the authenticated user.
- **🏗️ Global State:** Centralized auth and task state management using Zustand, hydrated from server-side data.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Usage |
| :--- | :--- |
| **Next.js 15 (App Router)** | Server Components, Server Actions, and Middleware |
| **TypeScript** | Static typing for enterprise-grade reliability |
| **Tailwind CSS v4** | Modern, utility-first styling with the Zinc palette |
| **Zustand** | Lightweight, high-performance state management |
| **Axios** | Promised-based HTTP client with request interceptors |
| **js-cookie** | Client-side cookie management for JWT persistence |

### Backend
| Technology | Usage |
| :--- | :--- |
| **Strapi v5** | Headless CMS and RESTful API framework |
| **SQLite** | Local development database (via better-sqlite3) |
| **JWT** | Secure authentication and authorization tokens |
| **TypeScript** | Type-safe custom controller overrides |

---

## 📐 Project Architecture

The application follows a decoupled client-server architecture with modern Next.js patterns:

1.  **Frontend (Next.js):** 
    - **Server Components:** The `/dashboard` fetches its initial data on the server.
    - **Server Actions:** Login and Signup forms submit directly to server-side functions.
2.  **Backend (Strapi):** Manages the database and enforces business logic through custom controllers.
3.  **Authentication:** Server Actions set `httpOnly` secure cookies, which are then used by Middleware for route protection and by the SSR layer for authenticated API calls.
4.  **Hydration:** Client Components receive initial data from Server Components and use Zustand for real-time state updates.

---

## 🔐 Authentication Flow

1.  **Submission:** User submits the form; the **Server Action** receives the data.
2.  **Verification:** The server-side function validates credentials with Strapi.
3.  **Response:** The server receives a JWT and user profile.
4.  **Cookie Storage:** The server sets secure cookies (`authToken` and `authUser`) before redirecting.
5.  **SSR Rendering:** On redirect to `/dashboard`, the server reads the cookie and fetches the user's todos immediately.
6.  **Client Hydration:** The dashboard rendered on the server is "hydrated" on the client, enabling interactive features like toggling and deleting.

---

## 🛡️ Secure Backend Ownership Validation

The backend is hardened with custom logic to ensure data integrity:
1.  **JWT Identification:** Extracts the true user identity directly from the decoded JWT (`ctx.state.user`).
2.  **Automatic Linking:** The `create` controller automatically injects the user's ID into the new todo.
3.  **Ownership Check:** The `update` and `delete` controllers verify that the requester is the original owner of the task, preventing ID-spoofing attacks.

---

## 🚀 Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/gtathelegend/secure-todo-app.git
cd secure-todo-app
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run build
npm run develop
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Access App at: http://localhost:3000*

---

### 👨‍💻 Author
**Built by Vedaang Sharma**  
[GitHub](https://github.com/gtathelegend) • [LinkedIn](https://linkedin.com/in/vedaangsharma2006)

### 📄 License
This project is licensed under the **MIT License**.
