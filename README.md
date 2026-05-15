# Secure Todo App

A minimalist, modern, and professional todo application built with focus on privacy and speed. This project features a robust authentication system and a clean, distraction-free interface.

## 🚀 Features

- **Minimalist Design:** A clean, professional UI built with the `zinc` color palette and Geist typography.
- **Secure Authentication:** Account-based access using JWT and Strapi's Users & Permissions plugin.
- **Task Management:** Create, complete, and delete tasks with immediate visual feedback.
- **Responsive Layout:** Fully optimized for both desktop and mobile devices.
- **Privacy First:** Your todos are private and tied exclusively to your authenticated account.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

### Backend
- **Framework:** [Strapi v5](https://strapi.io/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [SQLite](https://www.sqlite.org/) (via `better-sqlite3`)

## 📡 API Documentation

The backend provides a RESTful API. The base URL is typically `http://localhost:1337/api`.

### Authentication
- `POST /auth/local/register`: Create a new user account.
  - Body: `{ "username": "...", "email": "...", "password": "..." }`
- `POST /auth/local`: Authenticate a user and receive a JWT.
  - Body: `{ "identifier": "...", "password": "..." }`

### Todos (Requires Auth Header)
- `GET /todos`: Retrieve all todos for the authenticated user.
- `POST /todos`: Create a new todo.
  - Body: `{ "data": { "title": "..." } }`
- `PUT /todos/:id`: Update an existing todo (e.g., mark as completed).
  - Body: `{ "data": { "isCompleted": true } }`
- `DELETE /todos/:id`: Remove a todo.

*Note: All Todo requests must include the header `Authorization: Bearer <your_jwt_token>`.*

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 20.x.x
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
npm run build
npm run develop
```
The Strapi admin panel will be available at `http://localhost:1337/admin`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

## 🎨 Design Philosophy

This application follows a **Minimalist Modern** design philosophy:
- **Light Palette Only:** A pure white and neutral zinc palette for a professional look.
- **High Contrast:** Clear visual hierarchy using bold typography and subtle borders.
- **Interactive Feedback:** Vibrant action colors (Emerald for completion, Rose for deletion) to guide user interaction.
- **Whitespace:** Ample breathing room to reduce cognitive load and focus on productivity.

## 📄 License
This project is for demonstration purposes.
