#  Messaging Task – Real-Time Messaging API

A lightweight real-time messaging API with authentication, password reset via email, and modular architecture using **Node.js**, **Express**, **MongoDB**, and **Socket.io**.

---

##  Project Setup

### Prerequisites

- Node.js ≥ 14.x  
- MongoDB Atlas URI (for cloud DB)

### Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/Iam-Tech02/playhousemedia.git
   cd messaging_task
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   CLIENT_URL=http://localhost:3000
   ```

4. **Run the app**

   - Development mode:

     ```bash
     npm run dev
     ```

   - Production mode:

     ```bash
     npm start
     ```

5. **Run tests**

   ```bash
   npm test
   ```

---

##  Architecture Overview

```
src/
│
├── config/           # MongoDB and Email configurations
├── controllers/      # Auth, user, and message logic
├── middleware/       # Auth middleware and error handling
├── models/           # Mongoose schemas (User, Message)
├── routes/           # Express route handlers
├── tests/            # Unit and integration tests using Jest + Supertest
├── utils/            # Utility functions (e.g., token generation)
├── validation/       # Joi schemas for request validation
└── server.js         # Main entry point for the Express app
```

- **Modular & Scalable**: Each concern is isolated for testability and ease of maintenance.
- **Environment Config**: Supports different DB URIs for development and test environments.

---

##  Features

- User Signup & Login (JWT-based)
- Protected Routes with Token Verification
- Password Reset (Email + Token-based)
- Real-time Messaging (via Socket.io)

---

##  Trade-offs / Known Limitations
-  Uses plain Nodemailer with basic email/password auth (better to use OAuth2 in production).
-  JWT secrets and email passwords must be securely managed (dotenv is used but rotate secrets in real deployment).

---

## Scripts

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  
}

