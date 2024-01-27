from flask import Flask, render_template, request
import openai

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def medicine_info():
    if request.method == 'POST':
        medicine_name = request.form['medicine_name']
        prompt = f"Tell me about the medicine {medicine_name}. I want to know its uses, dosage, side effects, and precautions."

        # Use the OpenAI API to generate a response
        openai.api_key = 'API_Key'
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
        
        return render_template('index.html', medicine_info=medicine_info_html)

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
