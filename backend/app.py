from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
# 1. Import check_password_hash
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# --- NEW: API Endpoint for User Login ---
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    aadhar_number = data.get('aadhar')
    password = data.get('password')

    if not aadhar_number or not password:
        return jsonify({"error": "Aadhar number and password are required"}), 400

    conn = get_db_connection()
    # Find the user by their Aadhar number
    user = conn.execute('SELECT * FROM users WHERE aadhar_number = ?', (aadhar_number,)).fetchone()
    conn.close()

    # Check if the user exists and if the password is correct
    if user and check_password_hash(user['password_hash'], password):
        # Passwords match! User is authenticated.
        return jsonify({
            "message": "Login successful!",
            "user": { # Send back some non-sensitive user data
                "id": user['id'],
                "fullName": user['full_name']
            }
        }), 200
    else:
        # User not found or password incorrect. Use a generic message for security.
        return jsonify({"error": "Invalid Aadhar number or password"}), 401
# Add these three new routes to your app.py file

# Add these two new routes to your app.py file

# --- API Endpoint to GET a user's profile information ---
@app.route('/api/profile', methods=['GET'])
def get_profile():
    logged_in_user_id = 1 # SIMULATED logged-in user

    conn = get_db_connection()
    # Select all user data EXCEPT the password hash for security
    user = conn.execute('''
        SELECT id, full_name, aadhar_number, phone_number,
               share_location, guardian_alerts, crowd_alerts
        FROM users WHERE id = ?
    ''', (logged_in_user_id,)).fetchone()
    conn.close()

    if user is None:
        return jsonify({"error": "User not found"}), 404

    return jsonify(dict(user))


# --- NEW: Endpoint to UPDATE a user's personal info ---
@app.route('/api/profile', methods=['PUT'])
def update_profile():
    logged_in_user_id = 1 # SIMULATED logged-in user
    data = request.get_json()

    # We only allow updating the full name and phone number
    full_name = data.get('full_name')
    phone_number = data.get('phone_number')

    if not full_name or not phone_number:
        return jsonify({"error": "Full name and phone number are required"}), 400

    conn = get_db_connection()
    conn.execute('''
        UPDATE users SET
            full_name = ?,
            phone_number = ?
        WHERE id = ?
    ''', (full_name, phone_number, logged_in_user_id))
    conn.commit()
    conn.close()

    return jsonify({"message": "Profile updated successfully"}), 200


# --- API Endpoint to UPDATE a user's safety preferences ---
@app.route('/api/profile/preferences', methods=['PUT'])
def update_preferences():
    logged_in_user_id = 1 # SIMULATED logged-in user
    data = request.get_json()

    conn = get_db_connection()
    conn.execute('''
        UPDATE users SET
            share_location = ?,
            guardian_alerts = ?,
            crowd_alerts = ?
        WHERE id = ?
    ''', (
        data.get('share_location'),
        data.get('guardian_alerts'),
        data.get('crowd_alerts'),
        logged_in_user_id
    ))
    conn.commit()
    conn.close()

    return jsonify({"message": "Preferences updated successfully"}), 200

# --- API Endpoint to GET all of a user's emergency contacts ---
@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    # SIMULATE a logged-in user. In a real app, this would come from a secure token.
    logged_in_user_id = 1 

    conn = get_db_connection()
    contacts = conn.execute('SELECT * FROM emergency_contacts WHERE user_id = ?',
                            (logged_in_user_id,)).fetchall()
    conn.close()

    return jsonify([dict(row) for row in contacts])

# --- API Endpoint to ADD a new emergency contact ---
@app.route('/api/contacts', methods=['POST'])
def add_contact():
    logged_in_user_id = 1
    data = request.get_json()
    name = data.get('name')
    phone_number = data.get('phoneNumber')

    if not name or not phone_number:
        return jsonify({"error": "Name and phone number are required"}), 400

    conn = get_db_connection()
    conn.execute('INSERT INTO emergency_contacts (user_id, name, phone_number) VALUES (?, ?, ?)',
                 (logged_in_user_id, name, phone_number))
    conn.commit()

    # Get the newly created contact to send back to the frontend
    new_contact = conn.execute('SELECT * FROM emergency_contacts WHERE id = ?',
                               (conn.execute('SELECT last_insert_rowid()').fetchone()[0],)).fetchone()
    conn.close()

    return jsonify(dict(new_contact)), 201

# --- API Endpoint to DELETE an emergency contact ---
@app.route('/api/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    logged_in_user_id = 1

    conn = get_db_connection()
    # Ensure the user owns this contact before deleting
    contact = conn.execute('SELECT * FROM emergency_contacts WHERE id = ? AND user_id = ?',
                           (contact_id, logged_in_user_id)).fetchone()

    if contact is None:
        conn.close()
        return jsonify({"error": "Contact not found or you do not have permission to delete it"}), 404

    conn.execute('DELETE FROM emergency_contacts WHERE id = ?', (contact_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Contact deleted successfully"}), 200

# Add these two new routes to your app.py file

# --- Update the GET feedback route ---
@app.route('/api/feedback', methods=['GET'])
def get_feedback():
    conn = get_db_connection()
    # Add f.user_id to the SELECT statement
    posts = conn.execute('''
        SELECT f.id, f.station, f.content, f.upvotes, f.downvotes, f.user_id, u.full_name as author
        FROM feedback f JOIN users u ON f.user_id = u.id
        ORDER BY f.created_at DESC
    ''').fetchall()
    conn.close()
    feedback_list = [dict(row) for row in posts]
    return jsonify(feedback_list)

# --- NEW: Endpoint to POST new feedback ---
@app.route('/api/feedback', methods=['POST'])
def add_feedback():
    logged_in_user_id = 1 # DUMMY
    data = request.get_json()
    station = data.get('station')
    content = data.get('content')
    if not station or not content:
        return jsonify({"error": "Station and feedback content are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO feedback (station, content, user_id) VALUES (?, ?, ?)',
                 (station, content, logged_in_user_id))
    new_post_id = cursor.lastrowid # Get the ID of the new post
    conn.commit()

    # --- NEW: Fetch the complete new post to send back ---
    new_post = conn.execute('''
        SELECT f.id, f.station, f.content, f.upvotes, f.downvotes, f.user_id, u.full_name as author
        FROM feedback f JOIN users u ON f.user_id = u.id
        WHERE f.id = ?
    ''', (new_post_id,)).fetchone()

    conn.close()
    return jsonify(dict(new_post)), 201
# (Your existing signup, test, and contact routes remain below)
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    # ... (existing signup code)
    data = request.get_json()
    full_name = data.get('fullName')
    aadhar_number = data.get('aadhar')
    phone_number = data.get('phoneNumber')
    password = data.get('password')
    if not all([full_name, aadhar_number, phone_number, password]):
        return jsonify({"error": "All fields are required"}), 400
    if len(aadhar_number) != 12 or not aadhar_number.isdigit():
        return jsonify({"error": "Invalid Aadhar number"}), 400
    last_digit = int(aadhar_number[-1])
    if last_digit % 2 != 0:
        return jsonify({"error": "Registration is available for female users only"}), 403
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE aadhar_number = ?', (aadhar_number,)).fetchone()
    if user:
        conn.close()
        return jsonify({"error": "User with this Aadhar number already exists"}), 409
    password_hash = generate_password_hash(password)
    conn.execute('INSERT INTO users (full_name, aadhar_number, phone_number, password_hash) VALUES (?, ?, ?, ?)',
                 (full_name, aadhar_number, phone_number, password_hash))
    conn.commit()
    conn.close()
    return jsonify({"message": "User created successfully!"}), 201

@app.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Hello from the SafarGuardia Backend!"})

@app.route('/api/contact', methods=['POST'])
def handle_contact_form():
    # ... (existing contact form code)
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    if not name or not email or not message:
        return jsonify({"error": "Missing data"}), 400
    conn = get_db_connection()
    conn.execute('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
                 (name, email, message))
    conn.commit()
    conn.close()
    return jsonify({"message": "Message received successfully!"}), 201

# --- Update the DELETE feedback route ---
@app.route('/api/feedback/<int:post_id>', methods=['DELETE'])
def delete_feedback(post_id):
    # SIMULATE a logged-in user. In a real app, this ID would come from a secure token.
    logged_in_user_id = 1 

    conn = get_db_connection()
    # First, find who the author of the post is
    post = conn.execute('SELECT user_id FROM feedback WHERE id = ?', (post_id,)).fetchone()

    if post is None:
        conn.close()
        return jsonify({"error": "Post not found"}), 404

    # Check for ownership
    if post['user_id'] != logged_in_user_id:
        conn.close()
        return jsonify({"error": "Forbidden: You can only delete your own posts"}), 403

    # If the check passes, delete the post
    conn.execute('DELETE FROM feedback WHERE id = ?', (post_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Feedback post deleted successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5001)
