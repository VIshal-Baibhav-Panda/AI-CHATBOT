from flask import Flask, request, jsonify, render_template
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()


app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("OPENROUTER_API_KEY")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "meta-llama/llama-3-8b-instruct",
            "messages": [
                {"role": "user", "content": user_message}
            ]
        }
    )

    data = response.json()
    print(data)  # DEBUG

    try:
        reply = data["choices"][0]["message"]["content"]
    except:
        reply = "Error: " + str(data)

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True)