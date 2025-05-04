import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Importing external CSS for styling

function App() {
  const [formData, setFormData] = useState({
    male: "",
    age: "",
    education: "",
    currentSmoker: "",
    cigsPerDay: "",
    BPMeds: "",
    prevalentStroke: "",
    prevalentHyp: "",
    diabetes: "",
    totChol: "",
    sysBP: "",
    diaBP: "",
    BMI: "",
    heartRate: "",
    glucose: "",
  });

  const [risk, setRisk] = useState(null);
  const [tips, setTips] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/predict", formData);
      setRisk(response.data.risk);
      setTips(response.data.tips);
    } catch (error) {
      console.error("Error making prediction:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>Heart Disease Risk Prediction</h1>
      <form onSubmit={handleSubmit} className="prediction-form">
        {/* Add form inputs for all 16 factors */}
        {/* Gender */}
        <div className="form-group">
          <label>Gender:</label>
          <select name="male" value={formData.male} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="1">Male</option>
            <option value="0">Female</option>
          </select>
        </div>
        
        {/* Age */}
        <div className="form-group">
          <label>Age (Min: 18 Max: 100):</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="18"
            max="100"
          />
        </div>

        {/* Education */}
        <div className="form-group">
          <label>Education Level:</label>
          <select name="education" value={formData.education} onChange={handleChange} required>
            <option value="">Select Education Level</option>
            <option value="1">Primary School</option>
            <option value="2">High School</option>
            <option value="3">PU College</option>
            <option value="4">Graduate</option>
            <option value="5">Post Graduate</option>
          </select>
        </div>

        {/* Smoking */}
        <div className="form-group">
          <label>Do you smoke?</label>
          <select name="currentSmoker" value={formData.currentSmoker} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Cigarettes per day */}
        <div className="form-group">
          <label>Cigarettes per day (if smoker):</label>
          <input
            type="number"
            name="cigsPerDay"
            value={formData.cigsPerDay}
            onChange={handleChange}
            disabled={formData.currentSmoker === "0"}
          />
        </div>

        {/* Blood Pressure Medication */}
        <div className="form-group">
          <label>Taking Blood Pressure Medication?</label>
          <select name="BPMeds" value={formData.BPMeds} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* History of Stroke */}
        <div className="form-group">
          <label>History of Stroke:</label>
          <select name="prevalentStroke" value={formData.prevalentStroke} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* History of High Blood Pressure */}
        <div className="form-group">
          <label>History of High Blood Pressure:</label>
          <select name="prevalentHyp" value={formData.prevalentHyp} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Diabetes */}
        <div className="form-group">
          <label>Diabetes:</label>
          <select name="diabetes" value={formData.diabetes} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Total Cholesterol */}
        <div className="form-group">
          <label>Total Cholesterol (mg/dL) (Min:100 Max: 400)::</label>
          <input
            type="number"
            name="totChol"
            value={formData.totChol}
            onChange={handleChange}
            required
            min="100"
            max="400"
          />
        </div>

        {/* Systolic Blood Pressure */}
        <div className="form-group">
          <label>Systolic Blood Pressure (mmHg) (Min:80 Max: 250):</label>
          <input
            type="number"
            name="sysBP"
            value={formData.sysBP}
            onChange={handleChange}
            required
            min="80"
            max="250"
          />
        </div>

        {/* Diastolic Blood Pressure */}
        <div className="form-group">
          <label>Diastolic Blood Pressure (mmHg) (Min: 40 Max: 120):</label>
          <input
            type="number"
            name="diaBP"
            value={formData.diaBP}
            onChange={handleChange}
            required
            min="40"
            max="120"
          />
        </div>

        {/* BMI */}
        <div className="form-group">
          <label>BMI (kg/m²)  (Min: 10 Max: 50):</label>
          <input
            type="number"
            name="BMI"
            value={formData.BMI}
            onChange={handleChange}
            required
            min="10"
            max="50"
          />
        </div>

        {/* Heart Rate */}
        <div className="form-group">
          <label>Heart Rate (bpm) (Min: 40 Max: 200):</label>
          <input
            type="number"
            name="heartRate"
            value={formData.heartRate}
            onChange={handleChange}
            required
            min="40"
            max="200"
          />
        </div>

        {/* Glucose Level */}
        <div className="form-group">
          <label>Glucose Level (mg/dL) (Min: 50 Max: 200):</label>
          <input
            type="number"
            name="glucose"
            value={formData.glucose}
            onChange={handleChange}
            required
            min="50"
            max="200"
          />
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>

      {risk && (
  <div className="result">
    <h2>Risk Level: {risk}</h2>
    <h3>Health Tips:</h3>
    <div>
      {tips.split("\n").map((tip, index) => (
        <p key={index}>{tip}</p>
      ))}
    </div>
  </div>
)}
    </div>
  );
}

export default App;
