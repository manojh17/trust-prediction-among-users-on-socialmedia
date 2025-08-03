from flask import Flask, render_template, request, redirect, url_for, session, flash
import json
import os
import hashlib
import pickle
import numpy as np
import pandas as pd
from functools import wraps
import joblib


app = Flask(__name__)
app.secret_key = 'bolt_ai_trust_predictor_secret_key'

# Ensure userdata directory exists
os.makedirs('userdata', exist_ok=True)

# Load model, scaler, and feature importance
# Load XGBoost model, scaler, and label encoder
import joblib 

def convert_numpy(obj):
    if isinstance(obj, np.generic):
        return obj.item()
    elif isinstance(obj, dict):
        return {k: convert_numpy(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy(i) for i in obj]
    else:
        return obj

 # Make sure this is at the top of your file

# Load XGBoost model, scaler, and label encoder using joblib
model = joblib.load("model/xgb_classifier_model.joblib")
scaler = joblib.load("model/scaler_xgb.joblib")
label_encoder = joblib.load("model/label_encoder.joblib")


with open("model/filtered_features.pkl", "rb") as f:
    filtered_importance = pickle.load(f)

features = filtered_importance.index.tolist()

# User data file
USERS_FILE = 'users.json'
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, 'w') as f:
        json.dump([], f)

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'email' not in session:
            flash('Please login to access this page', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Password hashing
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Load and save users
def load_users():
    with open(USERS_FILE, 'r') as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=4)

# Routes
@app.route('/')
def index():
    if 'email' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        if not name or not email or not password:
            flash('All fields are required', 'error')
            return render_template('register.html')
        users = load_users()
        for user in users:
            if user['email'] == email:
                flash('Email already registered', 'error')
                return render_template('register.html')
        new_user = {'name': name, 'email': email, 'password': hash_password(password)}
        users.append(new_user)
        save_users(users)
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        if not email or not password:
            flash('Email and password are required', 'error')
            return render_template('login.html')
        users = load_users()
        for user in users:
            if user['email'] == email and user['password'] == hash_password(password):
                session['email'] = email
                session['name'] = user['name']
                flash('Login successful!', 'success')
                return redirect(url_for('dashboard'))
        flash('Invalid email or password', 'error')
    return render_template('login.html')

@app.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    prediction_result = None
    if request.method == 'POST':
        try:
            # Extract input from form
            input_data = {key: float(request.form.get(key, 0)) for key in features}
            df_input = pd.DataFrame([input_data])[features]

            # Apply feature importance weighting
            for col in df_input.columns:
                df_input[col] *= filtered_importance[col]

            # Scale input
            scaled_input = scaler.transform(df_input)

            # Predict with XGBoost
            y_pred = model.predict(scaled_input)[0]
            y_proba = model.predict_proba(scaled_input)[0]

            predicted_label = label_encoder.inverse_transform([y_pred])[0]
            confidence = round(np.max(y_proba) * 100, 2)

            # Set confidence color
            color = "#00c853" if confidence >= 75 else "#ffab00" if confidence >= 50 else "#d50000"

            # Package result
            prediction_result = {
                'score': confidence,
                'color': color,
                'classification': predicted_label
            }

            # Save user predictions
            user_data_file = f"userdata/{session['email']}.json"
            if not os.path.exists(user_data_file):
                user_predictions = []
            else:
                with open(user_data_file, 'r') as f:
                    user_predictions = json.load(f)

            prediction_entry = {
    'input': convert_numpy(input_data),
    'result': convert_numpy(prediction_result)
}

            user_predictions.append(prediction_entry)
            with open(user_data_file, 'w') as f:
             json.dump(user_predictions, f, indent=4)

            

        except Exception as e:
            prediction_result = {
                'score': 0,
                'color': '#d50000',
                'classification': f'Error: {str(e)}'
            }

    return render_template('dashboard.html', name=session['name'], prediction_result=prediction_result, features=features)


@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out', 'info')
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=False,host:0.0.0.0,port:3001)














# from flask import Flask, request, render_template
# import pickle
# import numpy as np
# import pandas as pd

# app = Flask(__name__)

# # Load model, scaler, and feature importance
# with open("model/rf_model.pkl", "rb") as f:
#     model = pickle.load(f)

# with open("model/scaler.pkl", "rb") as f:
#     scaler = pickle.load(f)

# with open("model/filtered_features.pkl", "rb") as f:
#     filtered_importance = pickle.load(f)

# features = filtered_importance.index.tolist()

# @app.route("/", methods=["GET", "POST"])
# def index():
#     if request.method == "POST":
#         try:
#             input_data = {key: float(request.form[key]) for key in features}
#             df_input = pd.DataFrame([input_data])[features]

#             # Apply weights
#             for col in df_input.columns:
#                 df_input[col] *= filtered_importance[col]

#             # Scale
#             scaled_input = scaler.transform(df_input)

#             # Predict
#             prediction = model.predict(scaled_input)[0]
#             return render_template("index.html", result=prediction)
#         except Exception as e:
#             return render_template("index.html", result=f"Error: {e}")

#     return render_template("index.html", result=None)

# if __name__ == "__main__":
#     app.run(debug=False,host:0.0.0.0,port:3001)
