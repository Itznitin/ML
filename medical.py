from flask import Flask, render_template, request
import openai
import os
import google.generativeai as genai
from werkzeug.security import check_password_hash, generate_password_hash
from pymongo import MongoClient

app = Flask(__name__)

# Configure the Google GenerativeAI API
genai.configure(api_key=os.environ['GOOGLE_CLOUD_API_KEY'])

# Create a connection to your MongoDB instance
client = MongoClient('mongodb://localhost:27017/')
db = client['admin']  # replace with your database name
users = db['medimatrix']  # replace with your collection name

@app.route('/signup', methods=['POST'])
def signup():
    username = request.form.get('username')
    password = request.form.get('password')

    if not username or not password:
        return "Username and Password must be filled out", 400

    if users.find_one({"username": username}):
        return "Username already exists", 400

    users.insert_one({
        "username": username,
        "password": generate_password_hash(password)
    })

    return "User created successfully", 200

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    if not username or not password:
        return "Username and Password must be filled out", 400

    user = users.find_one({"username": username})

    if not user or not check_password_hash(user['password'], password):
        return "Invalid username or password", 400

    return "Logged in successfully", 200

@app.route('/', methods=['GET', 'POST'])
def medicine_info():
    medicine_info_html = None
    analysis_html = None

    if request.method == 'POST':
        if 'medical_image' in request.files and request.files['medical_image']:
            # Create an instance of the Google GenerativeAI API
            model = genai.GenerativeModel('gemini-pro-vision')

            # Analyze the image using the 'gemini-pro-vision' model
            image_file = request.files['medical_image']
            image_data = image_file.read()
            image_part = {
                "mime_type": image_file.content_type,
                "data": image_data
            }
            prompt_parts = [
                "You are a helpful assistant. Analyze the following image and provide a detailed report on any abnormalities, and symptoms. Please format the report as follows:\n\n"
    " *Report:*  describe the key findings from the medical report in proper way.\n"
    " *Abnormalities:* List any abnormalities detected in the image and describe their characteristics.\n"
    " *Symptoms:* Describe any symptoms that might be associated with these diagnoses.\n\n",
    image_part,
]
            response = model.generate_content(prompt_parts)

            # Extract the content from the response
            analysis = response.text  # Use 'text' instead of 'generated_text'

            # Remove the double asterisks from the analysis
            analysis = analysis.replace('*', '')

            # Format the analysis as HTML
            analysis_html = f"<h3>Analysis</h3>{analysis.replace('Abnormalities:', '<h4>Abnormalities:</h4>').replace('Report:', '<h4>Report:</h4>').replace('Symptoms:', '<h4>Symptoms:</h4>').replace('Recommendations:', '<h4>Recommendations:</h4>')}"
        elif 'medicine_name' in request.form and request.form['medicine_name']:
            medicine_name = request.form['medicine_name']
            prompt = f"Tell me about the medicine {medicine_name}. I want to know its uses, dosage, side effects, and precautions in proper format."
            # Use the OpenAI API to generate a response
            openai.api_key = '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'
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt},
                ]
            )

            # Extract the content from the response
            medicine_info = response['choices'][0]['message']['content']

            # Format the response as HTML
            medicine_info_html = f"<h3>{medicine_name}</h3>{medicine_info.replace('Uses:', '<h4>Uses:</h4>').replace('Dosage:', '<h4>Dosage:</h4>').replace('Side Effects:', '<h4>Side Effects:</h4>').replace('Precautions:', '<h4>Precautions:</h4>')}"
            
    return render_template('index.html', medicine_info=medicine_info_html, analysis=analysis_html)

if __name__ == '__main__':
    app.run(debug=True)