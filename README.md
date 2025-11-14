# 🌍 Food Wastage Tracker - SDG Initiative

A full-stack MERN (MongoDB, Express, React, Node.js) application designed to help track food waste and promote UN Sustainable Development Goal 12: Responsible Consumption and Production.

## ✨ Features

- 📊 **Real-time Dashboard** - Visual statistics and analytics
- ➕ **Track Waste** - Log food waste entries with detailed information
- 📜 **History Management** - View and manage all waste entries
- 📈 **Analytics** - Detailed breakdowns by category and reason
- 💡 **Reduction Tips** - Practical advice for reducing food waste
- 🌱 **SDG Alignment** - Educational content about SDG 12
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS (via CDN)
- Fetch API for HTTP requests

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/food-wastage-tracker.git
cd food-wastage-tracker
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/food-wastage-tracker
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-wastage-tracker

# Start the backend server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to client directory (from root)
cd client

# Install dependencies
npm install

# Start the React development server
npm start
```

The React app will run on `http://localhost:3000`

## 📁 Project Structure

```
food-wastage-tracker/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   └── index.js
│   └── package.json
├── server/                # Node.js backend
│   ├── server.js          # Express server & API routes
│   ├── .env.example       # Environment variables template
│   └── package.json
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Waste Entries
- `GET /api/waste-entries` - Get all waste entries
- `GET /api/waste-entries/:id` - Get single waste entry
- `POST /api/waste-entries` - Create new waste entry
- `PUT /api/waste-entries/:id` - Update waste entry
- `DELETE /api/waste-entries/:id` - Delete waste entry

### Statistics
- `GET /api/statistics` - Get aggregated statistics

### Health Check
- `GET /api/health` - Server health check

## 💾 Database Schema

```javascript
{
  foodItem: String (required),
  category: String (enum, required),
  quantity: Number (required, min: 0.1),
  reason: String (enum, required),
  notes: String (optional),
  userId: String (default: 'default-user'),
  createdAt: Date (auto-generated)
}
```

## 🌐 MongoDB Atlas Setup (Cloud Database)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string and add to `.env` file

## 🚢 Deployment

### Backend Deployment (Heroku, Railway, Render)

1. Set environment variables in your hosting platform
2. Deploy the `server` directory
3. Ensure MongoDB Atlas connection string is configured

### Frontend Deployment (Vercel, Netlify)

1. Build the React app: `npm run build`
2. Deploy the `client/build` directory
3. Update API_URL to point to your backend server

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🎯 About SDG 12

**Target 12.3:** By 2030, halve per capita global food waste at the retail and consumer levels and reduce food losses along production and supply chains, including post-harvest losses.

Learn more at [UN Sustainable Development Goals](https://sdgs.un.org/goals/goal12)

## 📧 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/YOUR-USERNAME/food-wastage-tracker](https://github.com/YOUR-USERNAME/food-wastage-tracker)

---

Made with ❤️ for a sustainable future 🌍
