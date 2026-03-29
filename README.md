# Savety - Secure Image Management & Discovery

Savety is a premium, minimalist image management system designed for clarity, simplicity, and performance. Inspired by modern design systems like Ente, it provides a seamless experience for users to store, manage, and discover images.

![Savety Banner](https://via.placeholder.com/1200x400?text=Savety+Image+Management) <!-- Replace with a real banner if available -->

## ✨ Features

- **🔐 Secure Authentication**: Robust user authentication including signup, login, OTP verification, and password management.
- **🖼️ Smart Gallery**: Organized view of your personal image collection with high-performance rendering.
- **🚀 Advanced Uploads**: Support for single and bulk image uploads with detailed metadata management.
- **🌍 Discovery**: Explore public images shared by the community in a beautifully designed discovery feed.
- **👤 User Profiles**: Customizable personal profiles and public profiles for showcasing collections.
- **📱 Responsive & Premium UI**: A high-end, minimalist interface built with custom CSS tokens, ensuring a premium feel across all devices.
- **☁️ Cloud-Native**: Seamless integration with Cloudinary for reliable and fast image storage and delivery.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: React Hooks
- **Styling**: Vanilla CSS with custom design tokens
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Routing**: [React Router Dom](https://reactrouter.com/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

### Backend
- **Framework**: [Express 5](https://expressjs.com/)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **Dependency Injection**: [InversifyJS](https://inversify.io/)
- **Storage**: [Cloudinary](https://cloudinary.com/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: JWT & bcryptjs

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shamveelp/Savety.git
   cd Savety
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory based on the following template:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_email
   SMTP_PASS=your_email_password
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

### Running the Application

- **Backend (Development)**:
  ```bash
  cd backend
  npm run dev
  ```
- **Frontend (Development)**:
  ```bash
  cd frontend
  npm run dev
  ```

The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```text
Savety/
├── backend/                # Express Server (TypeScript)
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   └── config/         # App configurations
├── frontend/               # React Client (Vite + TS)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # View components
│   │   ├── services/       # API integration
│   │   └── assets/         # Styles and images
└── README.md
```

## 📜 License

This project is licensed under the ISC License.

---
Developed with ❤️ by [Shamveel P](https://github.com/shamveelp)
