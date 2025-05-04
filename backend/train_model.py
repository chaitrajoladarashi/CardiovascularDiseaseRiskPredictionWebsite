import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
import pickle

# Load your dataset
df = pd.read_csv('framingham.csv')  # Ensure you're using the correct dataset path

# Define the feature columns and the target variable
features = ['male','age','education', 'currentSmoker', 'cigsPerDay', 'BPMeds', 'prevalentStroke',
            'prevalentHyp', 'diabetes', 'totChol', 'sysBP', 'diaBP', 'BMI', 'heartRate', 'glucose']
X = df[features]
y = df['TenYearCHD']

# Handle missing values by imputing with the mean for numerical columns
imputer = SimpleImputer(strategy='mean')
X_imputed = imputer.fit_transform(X)

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_imputed, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the trained model
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Model trained and saved successfully.")
