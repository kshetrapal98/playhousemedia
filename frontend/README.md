# 🚀 Next.js AI Chat App

This is a modern **Next.js application** that includes user authentication and an AI-powered chat interface. It is built using the `app/` directory (App Router) and supports login, signup, password reset, and **real-time messaging** powered by **Socket.IO**.

---

## 📁 Project Structure

app/ ├── page.tsx # Login page ├── signup/ # Signup form and logic ├── forgotpassword/ # Forgot password form ├── resetpassword/ # Password reset form ├── chatWithAI/ # Protected AI chat interface

---

## 🛠 Features

- ✅ User Login & Signup
- 🔐 Forgot and Reset Password Flow
- 💬 Real-Time AI Chat Interface using Socket.IO
- 🍪 Auth token stored in cookies
- ⚡ Built with Next.js App Router (`app/` directory)

---

## 📦 Installation

```bash
git clone https://github.com/Iam-Tech02/playhousemedia.git
cd your-repo-name
npm install
🚀 Run the App

npm run dev
Visit: http://localhost:3000

📡 Real-Time Chat with Socket.IO
This project uses Socket.IO for real-time communication between the user and an AI backend.

🔌 How It Works
The frontend connects to the WebSocket server using socket.io-client.

The backend (Node.js or Express server) listens to messages and responds using AI logic (like OpenAI API).

📦 Install Socket.IO
Frontend:

npm install socket.io-client
Backend (Node.js example):

npm install socket.io express


🧪 Tech Stack
Next.js 13+ (App Router)

React 19

Cookie-based authentication