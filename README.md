# 🚖 Ride Booking

A **ride booking platform** built with modern technologies. This project provides a secure, scalable, and user-friendly system for riders and drivers to connect and manage ride bookings efficiently.

---

## 🌍 Live Deployment
[Live App Frontend](https://ride-booking-system-frontend.vercel.app/)
[Live App Backend](https://ride-booking-system-backend.vercel.app/)

---

## 📖 Project Overview
The Ride Booking API enables seamless booking, management, and completion of rides.  
It includes role-based access (Admin, Rider, Driver), safety contact features, and a smooth ride lifecycle process.

---

## ✨ Features
- 🔑 **Authentication & Authorization**
  - JWT-based secure login
  - Role-based access (Admin, Rider, Driver)

- 🚖 **Ride Management**
  - Request a ride
  - Accept a ride
  - Start & complete ride lifecycle

- 👥 **User Roles**
  - **Admin**: Manage users & rides
  - **Rider**: Request and manage bookings
  - **Driver**: Accept and complete rides

- 📱 **Safety Features**
  - Add emergency contacts
  - Retrieve saved contacts

- ⚡ **Other Features**
  - Input validation with Zod
  - Clean modular architecture
  - Error handling with custom middleware

---

## 🛠️ Technology Stack
- **Frontend Framework**: React (with React Router for routing), Redux Toolkit, RTK Query, Axios (optional)
- **Backend Framework**: Node.js, Express.js, TypeScript
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT & bcrypt
- **Validation**: Zod
- **Others**: CORS, dotenv, cookie-parser

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/ride-booking-api.git
cd ride-booking-api
```

### 2️⃣ Install dependencies
```bash
bun install
```

### 3️⃣ Environment variables
Create a `.env` file in the root with the following keys:
```env
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret
```

### 4️⃣ Run the project
```bash
bun run dev
```

Server will start on: **http://localhost:5000** 🚀

---

## 📌 Notes
- Make sure MongoDB is running locally or use **MongoDB Atlas** for cloud hosting.
- Use **Postman** or **Insomnia** to test API endpoints.
- Recommended Node.js version: **>=18**

---

## 👨‍💻 Author
Built with ❤️ by **Abdullah Al Towsif**
