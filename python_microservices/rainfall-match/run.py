from flask import Flask, jsonify, request
from app.services.rainfall import get_rainfall
from app.services.techniques import get_matching_techniques
from app.services.gemini import process_with_gemini

app = Flask(__name__)

@app.route("/get-techniques", methods=["POST"])
def get_techniques():
    data = request.get_json()
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if not latitude or not longitude:
        return jsonify({"error": "Coordinates are required"}), 400
    
    # Step 1: Get rainfall data based on coordinates
    rainfall = get_rainfall(latitude, longitude)

    if rainfall is None:
        return jsonify({"error": "Rainfall data not found"}), 404
    
    # Step 2: Match techniques based on rainfall
    techniques = get_matching_techniques(rainfall)

    # Step 3: Process techniques with Gemini for filtering
    processed_techniques = process_with_gemini(techniques)

    return jsonify({"rainfall": rainfall, "techniques": processed_techniques})

if __name__ == "__main__":
    app.run(debug=True)
