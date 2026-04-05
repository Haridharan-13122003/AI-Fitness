# AI Fitness Trainer

An AI-powered web application that serves as a personalized fitness trainer. This application allows users to register, log their routines, calculate BMI, get diet recommendations, track progress, and interact with a simple AI Chatbot.

## Features

- **User Authentication:** Secure registration and login.
- **Dashboard:** Overview of your fitness journey and metrics.
- **BMI Calculator:** Calculate your current Body Mass Index and receive actionable takeaways.
- **Personalized Workout:** Tailor-made workout strategies.
- **Diet & Nutrition guidance:** Maintain a sustainable caloric structure based on your goals.
- **Progress Tracking:** Interactive logging and progress visualization.
- **AI Chatbot:** Real-time chat assistant providing helpful tips on weight loss, muscle gain, stamina, and rest.

## Technologies Used

- **Frontend:** HTML5, Vanilla JS, CSS (Modern glassmorphism UI)
- **Backend:** 
  You can run the backend using either Node.js or Python!
  - **Node.js**: Express, bcryptjs
  - **Python**: Flask, Flask-CORS, Werkzeug
- **Database:** SQLite (Shared between both Python and Node implementations as `fitness.db`)

## Getting Started

You can choose to run this application using either **Node.js** or **Python**.

### Option 1: Running with Node.js (Recommended)

1. **Install Dependencies:**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```
2. **Start the Server:**
   ```bash
   npm start
   ```
   *or `node server.js`*
3. **Visit the App:**
   Open your browser and navigate to `http://localhost:3000`

### Option 2: Running with Python

1. **Create and activate a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Start the Server:**
   ```bash
   python app.py
   ```
4. **Visit the App:**
   Open your browser and navigate to `http://localhost:3000`

## Note on Switching Backends
While both backends function perfectly, they use different password hashing algorithms by default (`bcryptjs` vs `werkzeug.security`). Therefore, users registered via the Node.js backend might not be able to log in via the Python backend (and vice versa). For best results, pick one backend and stick with it!

## File Structure
- `public/` - Contains all frontend HTML, CSS, and JS files.
- `server.js` & `database.js` - Node.js Express server and database configuration.
- `app.py` - Alternative Python Flask server implementation.
- `fitness.db` - SQLite database (Auto-generated upon server start).
