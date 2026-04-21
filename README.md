# ExamNidhi - Academic PYQ Portal

ExamNidhi is a premium full-stack web application designed to help college students access and contribute Previous Year Question (PYQ) papers. It provides a structured, hierarchical navigation system to easily find relevant academic materials.

## 🚀 Features

- **Hierarchical Navigation**: Organize and find papers by **Year → Branch → Semester → Subject**.
- **Student Dashboard**: Personalized dashboard for students to view available materials.
- **Contribution System**: Students can upload their own PYQs to help fellow students.
- **Admin Panel**: Exclusive interface for administrators to manage, review, and delete paper uploads.
- **Secure Authentication**: JWT-based login and registration system with role-based access control (Student/Admin).
- **Modern UI/UX**: Premium design with dark/light mode support, responsive layouts, and micro-animations.
- **File Management**: efficient PDF handling using Multer for uploads and static serving for downloads.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (with [Vite](https://vitejs.dev/))
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **State Management**: React Context API
- **API Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Modern Vanilla CSS with a focus on premium aesthetics.

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens) & Bcryptjs
- **Authentication**: JWT (JSON Web Tokens) & Bcryptjs
- **Cloud Storage**: [Cloudinary](https://cloudinary.com/) (via `multer-storage-cloudinary`)
- **Security**: [Helmet](https://helmetjs.github.io/)
- **Performance**: [Compression](https://github.com/expressjs/compression)

---

## 🏗️ System Architecture

The project follows a classic MERN-like architecture (with Vite instead of CRA) providing a seamless flow of data between the client and the server.

### 1. Frontend (Client Side)
- Built with **React** for a dynamic and responsive user interface.
- Uses **Context API** to maintain user authentication state across the application.
- Employs **ProtectedRoute** and **AdminRoute** components to enforce access control.
- Communicates with the backend through standardized REST API calls via **Axios**.

### 2. Backend (Server Side)
- An **Express.js** server that handles all business logic and API endpoints.
- Middlewares like `cors`, `cookie-parser`, and `express.json` are used for request processing.
- Custom `authMiddleware` verifies JWT tokens to protect sensitive routes.
- **Multer** is configured with **CloudinaryStorage** to handle multi-part/form-data for PDF uploads, storing files securely in the cloud.

### 3. Database (Data Persistence)
- **MongoDB** stores persistent data including:
  - **Users**: Credentials (hashed), profile info (scholar number, branch), and roles.
  - **Papers**: Metadata such as:
    - `academicYear` (e.g., 1st Year, 2nd Year)
    - `branch` (e.g., Computer Science, Mechanical)
    - `semester` (e.g., Sem 1, Sem 2)
    - `subject` and `year` of the exam
    - `fileUrl` (Secure Cloudinary URL)
    - `cloudinaryId` (For asset management/deletion)
    - `isVerified` (Status for admin approval)

---

## 🔄 Data Flow

1.  **Authentication Flow**:
    - User submits credentials -> Backend validates & signs a JWT -> Token is sent to Frontend -> Frontend stores token/user state.
2.  **Paper Retrieval Flow**:
    - User selects filters (Branch/Year etc) -> Frontend sends GET request -> Backend queries MongoDB for **verified** papers -> Returns metadata -> Frontend renders links to static files.
3.  **Upload & Verification Flow**:
    - Student fills details (Subject, Year, Branch, etc.) and selects a PDF -> Frontend sends POST (multipart) -> Backend uploads file to **Cloudinary** -> Backend saves metadata with `isVerified: false` -> Admin reviews the upload in the Admin Panel -> Admin verifies or deletes the paper (which also removes it from Cloudinary).

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB URI (Local or Atlas)

### Backend Setup
1. Navigate to the `BACKEND` folder.
2. Install dependencies: `npm install`
### Backend Setup (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Frontend Setup (.env)
```env
VITE_BACKEND_URL=http://localhost:5000/api
```

---

## ☁️ Production Deployment

### Backend (Render)
1. Link your GitHub repository to **Render**.
2. Set Environment Variables mentioned above.
3. Use Build Command: `npm install`
4. Use Start Command: `npm start`

### Frontend (Vercel)
1. Import the `FRONTEND/mini` directory into **Vercel**.
2. Set `VITE_BACKEND_URL` to your Render API URL (e.g., `https://your-api.onrender.com/api`).
3. Vercel will automatically detect the Vite build settings.

---

## 📄 License
This project is licensed under the ISC License.
