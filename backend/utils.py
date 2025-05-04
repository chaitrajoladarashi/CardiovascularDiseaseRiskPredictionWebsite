import sqlite3

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn
# Get a database connection
conn = get_db_connection()

# Create a cursor object
cursor = conn.cursor()

# Execute a query
cursor.execute('SELECT * FROM some_table')

# Fetch all results
results = cursor.fetchall()

# Access columns by name
for row in results:
    print(row['column_name'])

# Close the connection
conn.close()
