from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
import time

app = Flask(__name__, static_folder='public')
CORS(app)
DB_PATH = 'fitness.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT,
                age INTEGER,
                height REAL,
                weight REAL,
                gender TEXT,
                goal TEXT
            )''')
    c.execute('''CREATE TABLE IF NOT EXISTS progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                date TEXT,
                weight REAL,
                notes TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )''')
    conn.commit()
    conn.close()

init_db()

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Serve frontend pages
@app.route('/')
def serve_index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('public', path)

# --- API ROUTES ---

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400
        
    hash_pw = generate_password_hash(password)
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hash_pw))
        conn.commit()
        last_id = cursor.lastrowid
        return jsonify({"message": "Registration successful", "userId": last_id}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 400
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (data.get('username'),)).fetchone()
    conn.close()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    if not check_password_hash(user['password'], data.get('password')):
        return jsonify({"error": "Invalid password"}), 401
        
    return jsonify({"message": "Login successful", "userId": user['id'], "username": user['username']})

@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    conn = get_db()
    user = conn.execute("SELECT id, username, age, height, weight, gender, goal FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(dict(user))

@app.route('/api/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    conn = get_db()
    conn.execute("UPDATE users SET age = ?, height = ?, weight = ?, gender = ?, goal = ? WHERE id = ?",
                 (data.get('age'), data.get('height'), data.get('weight'), data.get('gender'), data.get('goal'), user_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Updated successfully"})

@app.route('/api/progress', methods=['POST'])
def add_progress():
    data = request.get_json()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO progress (user_id, date, weight, notes) VALUES (?, ?, ?, ?)",
                   (data.get('user_id'), data.get('date'), data.get('weight'), data.get('notes')))
    conn.commit()
    last_id = cursor.lastrowid
    conn.close()
    return jsonify({"message": "Progress added", "progressId": last_id}), 201

@app.route('/api/progress/<int:user_id>', methods=['GET'])
def get_progress(user_id):
    conn = get_db()
    rows = conn.execute("SELECT * FROM progress WHERE user_id = ? ORDER BY date DESC", (user_id,)).fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route('/api/chat', methods=['POST'])
def chat():
    msg = request.get_json().get('message', '').lower()
    reply = "I'm your AI fitness assistant. Can you specify if you want advice on workouts, diet, or rest?"
    if "weight loss" in msg or "fat" in msg:
        reply = "For weight loss, focus on a caloric deficit and mix cardio with strength training!"
    elif "muscle" in msg or "gain" in msg:
        reply = "To gain muscle, ensure you eat in a caloric surplus with enough protein (1.6-2g per kg of body weight) and lift heavy!"
    elif "stamina" in msg or "running" in msg:
        reply = "Stamina improves with consistent aerobic exercise like running, cycling, or swimming. Start slow and gradually increase distance!"
    elif "hi" in msg or "hello" in msg:
        reply = "Hello! Ready to crush your fitness goals? What can I help you with today?"
        
    time.sleep(0.8)
    return jsonify({"reply": reply})

if __name__ == '__main__':
    app.run(port=3000, debug=True)
