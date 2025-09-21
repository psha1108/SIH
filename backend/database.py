import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# (Existing 'messages' table remains the same)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
''')

# --- UPDATE: Add new preference columns to the 'users' table ---
# We will add columns one by one to avoid errors if the table already exists
try:
    cursor.execute('ALTER TABLE users ADD COLUMN share_location BOOLEAN NOT NULL DEFAULT 0')
    cursor.execute('ALTER TABLE users ADD COLUMN guardian_alerts BOOLEAN NOT NULL DEFAULT 0')
    cursor.execute('ALTER TABLE users ADD COLUMN crowd_alerts BOOLEAN NOT NULL DEFAULT 0')
except sqlite3.OperationalError:
    # This will fail if the columns already exist, which is fine.
    print("User preference columns already exist.")

# (Existing 'users' table creation for first-time setup)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        aadhar_number TEXT UNIQUE NOT NULL,
        phone_number TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        share_location BOOLEAN NOT NULL DEFAULT 0,
        guardian_alerts BOOLEAN NOT NULL DEFAULT 0,
        crowd_alerts BOOLEAN NOT NULL DEFAULT 0
    )
''')

# (Existing 'feedback' table remains the same)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        station TEXT NOT NULL,
        content TEXT NOT NULL,
        upvotes INTEGER DEFAULT 0,
        downvotes INTEGER DEFAULT 0,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
''')

# --- NEW: Create the 'emergency_contacts' table ---
cursor.execute('''
    CREATE TABLE IF NOT EXISTS emergency_contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
''')

conn.commit()
conn.close()

print("Database schema updated successfully. All tables and columns are present.")