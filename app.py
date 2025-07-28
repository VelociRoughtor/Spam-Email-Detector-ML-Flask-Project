from flask import Flask, render_template, request, jsonify
import joblib

app = Flask(__name__)

model = joblib.load("spam_detector_nb.pkl")
vectorizer = joblib.load("vectorizer.pkl")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    email = data.get("email", "")
    if not email.strip():
        return jsonify({"error": "Empty input"}), 400

    vect = vectorizer.transform([email])
    pred = model.predict(vect)[0]
    prob = model.predict_proba(vect)[0][1]
    label = "Spam" if pred == 1 else "Ham"
    confidence = round(prob * 100, 2) if pred == 1 else round((1 - prob) * 100, 2)

    return jsonify({
        "prediction": label,
        "confidence": f"{confidence}%"
    })

if __name__ == "__main__":
    app.run(debug=True)
