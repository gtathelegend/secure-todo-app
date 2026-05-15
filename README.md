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

The **Secure Todo App** is a full-stack productivity tool engineered with a focus on **security, minimalism, and performance**. Unlike basic todo apps, this system implements a rigorous backend ownership validation layer that prevents unauthorized data access and manipulation.

Users can securely register and manage their private tasks through a modern, responsive dashboard. The application ensures seamless authentication persistence using JWT stored in secure cookies, integrated with Next.js Middleware for robust route protection.

### Key Highlights:
- **True Backend Ownership:** Every task is cryptographically linked to its creator via JWT.
- **Minimalist Aesthetic:** A distraction-free UI using the `zinc` color palette and high-quality typography.
- **Resilient Sessions:** Authentication persists across page refreshes and browser sessions.
- **Enterprise Patterns:** Uses centralized state management with Zustand and interceptor-based API communication.

---

## ✨ Features

- **🔐 Robust Authentication:** Full signup and login flows powered by Strapi’s Users & Permissions plugin.
- **🛡️ Protected Routes:** Next.js Middleware ensures the `/dashboard` is inaccessible to unauthenticated users.
- **💾 Persistent Sessions:** JWT tokens are stored in secure cookies, allowing users to stay logged in.
- **⚡ Real-time CRUD:** Create, Read, Update (Toggle), and Delete todos with immediate UI feedback.
- **🔒 Backend Validation:** Custom Strapi controllers automatically assign todos to the authenticated user and prevent cross-user data tampering.
- **📱 Responsive Design:** Optimized for mobile, tablet, and desktop viewports.
- **🔔 Interactive Feedback:** Integrated Toast notifications for successful actions and error handling.
- **🏗️ Global State:** Centralized auth and task state management using Zustand.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Usage |
| :--- | :--- |
| **Next.js 14/15** | App Router, Server Components, and Middleware |
| **TypeScript** | Static typing for enterprise-grade reliability |
| **Tailwind CSS** | Modern, utility-first styling with the Zinc palette |
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

The application follows a decoupled client-server architecture:

1.  **Frontend (Next.js):** Acts as the consumer. It handles the UI, routing, and client-side logic. It communicates with the backend via REST API calls.
2.  **Backend (Strapi):** Acts as the source of truth. It manages the database, authentication, and enforces business logic through custom controllers.
3.  **Communication Layer:** Axios interceptors automatically attach the `Authorization: Bearer <token>` header to outgoing requests if a JWT is present in cookies.
4.  **Security Layer:** Next.js Middleware checks for the presence of a JWT before rendering protected dashboard routes, while the backend validates ownership for every data modification request.

---

## 📂 Folder Structure

### Frontend
```text
frontend/
├── src/
│   ├── app/           # App Router (Home, Login, Signup, Dashboard)
│   ├── components/    # Reusable UI components
│   ├── lib/           # API configuration and Axios instances
│   ├── store/         # Zustand stores (authStore)
│   ├── types/         # TypeScript interfaces and types
│   └── middleware.ts  # Route protection and JWT validation
```

### Backend
```text
backend/
├── src/
│   ├── api/
│   │   └── todo/      # Todo content-type and custom controllers
│   ├── config/        # Database and server configuration
│   └── extensions/    # Overrides for Users-Permissions plugin
```

---

## 🔐 Authentication Flow

1.  **Submission:** User submits the login/register form.
2.  **Verification:** Strapi validates credentials against the database.
3.  **Response:** Strapi returns a unique JWT and user profile data.
4.  **Storage:** The JWT is saved in a secure cookie via `js-cookie`.
5.  **Protection:** Next.js Middleware detects the cookie and allows access to `/dashboard`.
6.  **Persistence:** On every request, Axios interceptors inject the JWT into the `Authorization` header.
7.  **Backend Check:** The backend decodes the JWT to identify the user and authorize the action.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/local/register` | Create a new user account | No |
| `POST` | `/auth/local` | Authenticate and get JWT | No |
| `GET` | `/todos` | Retrieve user's private tasks | Yes |
| `POST` | `/todos` | Create a new task (Auto-owner) | Yes |
| `PUT` | `/todos/:id` | Update task status or title | Yes |
| `DELETE` | `/todos/:id` | Remove a task | Yes |

---

## 🛡️ Secure Backend Ownership Validation

A critical security feature of this application is the **Backend Ownership Layer**. 

**Why it matters:** 
In insecure applications, the frontend might send the `userId` in the body of a request. A malicious user could easily change this ID to create or delete tasks for other users.

**How we solved it:**
We overrode the default Strapi controllers. The backend now:
1.  **Ignores Body IDs:** Completely ignores any user ID sent from the frontend.
2.  **JWT Identification:** Extracts the true user identity directly from the decoded JWT (`ctx.state.user`).
3.  **Automatic Linking:** Automatically injects the user's ID into the data object during creation.
4.  **Ownership Check:** For `update` and `delete` requests, it verifies that the task's owner ID matches the requester's ID before performing the operation.

---

## 🌐 Environment Variables

### Frontend (`frontend/.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:1337/api
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### Backend (`backend/.env`)
```bash
HOST=0.0.0.0
PORT=1337
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...
```

---

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/secure-todo-app.git
cd secure-todo-app
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run build
npm run develop
```
*Access Strapi Admin at: http://localhost:1337/admin*

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
