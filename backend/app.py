from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")  # Enable CORS for React app

# Load the pre-trained model
model = pickle.load(open('model.pkl', 'rb'))

# Define the database path
db_path = 'database.db'

# Function to create the database and tables
def create_db():
    if os.path.exists(db_path):
        os.remove(db_path)  # Delete the database file (for debugging purposes)
    
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # Create the predictions table
    c.execute('''CREATE TABLE IF NOT EXISTS predictions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    male INTEGER,
                    age INTEGER,
                    education INTEGER,
                    smoker INTEGER,
                    cigs_per_day INTEGER,
                    bp_meds INTEGER,
                    stroke INTEGER,
                    hyp INTEGER,
                    diabetes INTEGER,
                    chol INTEGER,
                    sysBP INTEGER,
                    diaBP INTEGER,
                    BMI REAL,
                    heartRate INTEGER,
                    glucose INTEGER,
                    risk_level TEXT)''')
    
    conn.commit()
    conn.close()

# Call the function to create the database and tables at startup
create_db()

# Database connection function
def get_db_connection():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def home():
    return "Heart Disease Risk Prediction API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    # Extract form data from the POST request
    data = request.get_json()

    # Extract the values from the received data
    input_data = [
        int(data['male']),
        int(data['age']),
        int(data['education']),
        int(data['currentSmoker']),
        int(data['cigsPerDay']),
        int(data['BPMeds']),
        int(data['prevalentStroke']),
        int(data['prevalentHyp']),
        int(data['diabetes']),
        int(data['totChol']),
        int(data['sysBP']),
        int(data['diaBP']),
        float(data['BMI']),
        int(data['heartRate']),
        int(data['glucose'])
    ]

    # Convert input data to numpy array for prediction
    input_array = np.array(input_data).reshape(1, -1)

    # Predict using the loaded model
    risk_prediction = model.predict(input_array)

    # Determine risk level based on classification output
    risk_level = "High" if risk_prediction[0] == 1 else "Low"

    # Provide personalized health tips based on input values
    tips = []

    # Access specific input values using their indices
    tot_chol = input_data[9]
    sys_bp = input_data[10]
    dia_bp = input_data[11]
    bmi = input_data[12]
    current_smoker = input_data[3]
    diabetes = input_data[8]

    if tot_chol > 200:
        tips.append("Your cholesterol level is high. Consider reducing saturated fats in your diet and eating more fiber-rich foods like oats, fruits, and vegetables.")

    if sys_bp >= 135 or dia_bp > 85:
        tips.append("Your blood pressure is high. To manage it, reduce salt intake, exercise regularly, and incorporate potassium-rich foods like bananas and leafy greens into your diet.")

    if bmi >= 25:
        tips.append("Your BMI indicates overweight. Aim to lose weight through a healthy diet and increased physical activity.")

    if current_smoker == 1:
        tips.append("You are a smoker. Quitting smoking is the most important step you can take to reduce your risk. Consider speaking with a healthcare professional for support in quitting.")

    if diabetes == 1:
        tips.append("You have diabetes. Monitor your blood sugar levels regularly and follow your doctor's advice.")

    if not tips:
        tips.append("Maintain your current healthy lifestyle with a balanced diet and regular exercise.")

    # Join tips into a single string with newlines
    tips = "\n".join(tips)

    # Insert the data into the SQLite database
    conn = get_db_connection()
    conn.execute("INSERT INTO predictions (male, age, education, smoker, cigs_per_day, bp_meds, stroke, hyp, diabetes, chol, sysBP, diaBP, BMI, heartRate, glucose, risk_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                 (*input_data, risk_level))
    conn.commit()
    conn.close()

    # Return the risk level and personalized tips as JSON
    return jsonify({"risk": risk_level, "tips": tips})

if __name__ == '__main__':
    app.run(debug=True)
