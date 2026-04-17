# Virtual Assistant - Backend

This is the backend service for the Virtual Assistant application. It is an Express.js server that handles authentication, user management, and integrates with the Google Gemini AI API to interpret user intents and generate voice assistant responses.

## Tech Stack

- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **Google Gemini API** - Natural Language Processing / Intent Detection
- **JWT (JSON Web Tokens)** - Authentication
- **Bcrypt.js** - Password hashing
- **Cloudinary & Multer** - Image uploads and storage

## Features

- **Intent Detection**: Analyzes user commands (e.g., "play song on youtube", "what is the weather") using Gemini AI to return structured JSON data.
- **Authentication**: User signup, login, and secure routes via JWT cookies.
- **User Management**: Profile updates and customized assistant configurations.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Google Gemini API Key
- Cloudinary Account (for image uploads)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` directory with the following configuration (replace with your actual values):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Running the Application

To start the development server (with nodemon):
```bash
npm run dev
```

The server will be running at `http://localhost:5000`.

### API Endpoints

- `POST /api/auth/...` - Authentication routes
- `GET /api/user/...` - User specific routes
- `GET /` - Test Gemini response with `?prompt=your_command`
