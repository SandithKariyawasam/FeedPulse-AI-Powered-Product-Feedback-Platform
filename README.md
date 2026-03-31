# ⚡ FeedPulse: AI-Powered Product Feedback Platform

FeedPulse is a premium, high-performance platform designed to help product teams bridge the gap between user feedback and actionable insights. Built with a stunning **Amber & White** aesthetic, it leverages the power of **Google Gemini AI** to automatically categorize, prioritize, and summarize incoming user feedback.

![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![CI - Code Quality Check](https://github.com/SandithKariyawasam/FeedPulse-AI-Powered-Product-Feedback-Platform/actions/workflows/ci.yml/badge.svg)

---

## ✨ Key Features

### 🤖 AI-Driven Intelligence
- **Automated Categorization**: Sorts feedback into Bugs, Feature Requests, Improvements, or Other.
- **Priority Scoring**: Assigns a 1-10 priority score based on impact and urgency.
- **Sentiment Analysis**: Detects Positive, Neutral, or Negative user sentiment.
- **On-Demand Summaries**: Generates high-level themes and trends from recent submissions using Google Gemini.

### 📊 Administrative Command Center
- **Feedback Lifecycle**: Update status (New, In Review, Resolved) or delete entries.
- **Advanced Controls**: Instant client-side search, multi-category filters, and dynamic sorting.
- **Real-time Analytics**: High-fidelity stats bar for total feedback, open items, and average priority.
- **AI Re-triggering**: Manually request a fresh AI analysis for any feedback item.

### 🎨 Premium User Experience
- **Vibrant Amber Theme**: A modern, cohesive design system across all landing, form, and admin pages.
- **Dynamic Interactions**: Micro-animations powered by Framer Motion.
- **Responsive Layout**: Optimized for desktop monitoring and mobile submission.
- **Intelligent Rate Limiting**: Advanced feedback for users including real-time "try again" countdowns.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15+, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, Gemini AI SDK.
- **Database**: MongoDB (Mongoose).
- **Containerization**: Docker & Docker Compose.
- **CI/CD**: GitHub Actions (Automated Linting & Builds).

---

## 🚀 One-Step Deployment (Docker)

The fastest way to get FeedPulse up and running is using Docker Compose.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SandithKariyawasam/FeedPulse-AI-Powered-Product-Feedback-Platform.git
   cd FeedPulse-AI-Powered-Product-Feedback-Platform
   ```

2. **Configure Environment**:
   Ensure your `backend/.env` is populated (see [Environment Variables](#-environment-variables) below).

3. **Launch the platform**:
   ```bash
   docker-compose up --build
   ```

4. **Access the App**:
   - **User Landing**: `http://localhost:3000`
   - **Admin Portal**: `http://localhost:3000/admin/login`

---

## 💻 Local Development

If you prefer to run the services manually:

### Backend
1. `cd backend`
2. `npm install`
3. `npm run dev` (Starts on port 4000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Starts on port 3000)

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory with the following:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
ADMIN_EMAIL=admin@feedpulse.com
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_signing_secret
```

*Note: For the frontend to communicate with the backend in certain environments, you can also set `NEXT_PUBLIC_API_URL` in the frontend environment.*

---

## 🛡️ Admin Access
The admin dashboard is protected via JWT authentication. Use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` defined in your environment variables to sign in.

---

## 🚀 Future Roadmap: What's Next?

If we had more time to evolve FeedPulse, these are the high-impact features we would prioritize:

- **🔗 Real-time Integrations**: Connect FeedPulse to **Slack** or **Discord** to provide instant notifications for high-priority feedback (Priority 8+).
- **📈 Advanced Analytics View**: Replace the stats bar with a dedicated analytics tab featuring **Recharts** for trend visualization, category distribution, and sentiment over time.
- **📩 Automated Email Alerts**: Implement an email service (like SendGrid or AWS SES) to notify admins whenever critical feedback is submitted.
- **📥 Data Portability**: Add "Export to CSV" and "Export to PDF" functions to allow admins to share AI-generated summaries with the broader product team.
- **🔐 User Profiles**: Optional user authentication for feedback submitters to track their own feedback history and receive status updates.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

Developed with ❤️ by the FeedPulse Team.