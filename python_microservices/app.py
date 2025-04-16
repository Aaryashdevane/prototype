from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import cloudinary
import cloudinary.uploader
import os
import PIL.Image
import google.generativeai as genai
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
from image_processing.categorizer import categorize
import requests
from io import BytesIO
import json
from pydantic import BaseModel
from geocode import router as geocode_router
import httpx
# 📌 Scraping runner

from scraping.api.routes import router as scraping_router  # ✅ Import the router

from scraping.run_pipeline import run_scraping_pipeline
# Load environment variables
load_dotenv()

# ✅ Configure Google Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("❌ Missing GEMINI_API_KEY environment variable!")
genai.configure(api_key=GEMINI_API_KEY)

# ✅ Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

# ✅ MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["complaints_db"]
collection = db["complaints"]

app = FastAPI()
app.include_router(geocode_router, prefix="/api/geocode")
# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],  # Change this if frontend is deployed elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
techniques_data = {
    "Rainwater Harvesting": [
        {"title": "Rainwater Harvesting", "description": "Capture and store rainwater for later use."},
        {"title": "Roof Rainwater Harvesting", "description": "Harvest rainwater from the roof for household use."}
    ],
    "Afforestation": [
        {"title": "Afforestation", "description": "Planting trees to prevent soil erosion and increase water retention."}
    ],
    "Groundwater Recharge": [
        {"title": "Recharge Wells", "description": "Use wells to recharge the groundwater table."},
        {"title": "Check Dams", "description": "Build check dams to help recharge groundwater."}
    ]
}
# Include the scraping router
app.include_router(scraping_router)  # ✅ Add the router


# 📌 1️⃣ IMAGE PROCESSING SERVICE
# --------------------------------------------------
# 📌 Submit Complaint
@app.post("/process-image/")
async def process_image(
    file: UploadFile = File(...),
    location: str = Form(...),
    user: str = Form(...),
    coordinates: str = Form(...),
    nearestDistrictCoordinates: str = Form(None)
):
    try:
        print("📥 Incoming Data:")
        print(f"Location: {location}")
        print(f"User: {user}")
        print(f"Coordinates: {coordinates}")
        print(f"File: {file.filename}")
        print(f"Nearest District Coordinates: {nearestDistrictCoordinates}")

        # Parse nearestDistrictCoordinates as an object
        nearest_district_coords = json.loads(nearestDistrictCoordinates) if nearestDistrictCoordinates else None

        cloudinary_response = cloudinary.uploader.upload(file.file)
        image_url = cloudinary_response.get("secure_url")

        if not image_url:
            raise HTTPException(status_code=500, detail="Failed to upload image.")

        response = requests.get(image_url)
        image = PIL.Image.open(BytesIO(response.content))

        model = genai.GenerativeModel("gemini-1.5-flash")
        gemini_response = model.generate_content([image, "Describe this image in detail."])
        description = gemini_response.text or "No description available"

        category = categorize(description)

        complaint_data = {
            "location": location,
            "description": description,
            "category": category,
            "image_url": image_url,
            "status": "Pending",
            "user": user,
            "coordinates": json.loads(coordinates),
            "nearestDistrictCoordinates": nearest_district_coords
        }

        inserted_id = collection.insert_one(complaint_data).inserted_id
        return {"message": "Submitted!", "id": str(inserted_id), "description": description, "category": category, "image_url": image_url, "coordinates": coordinates}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# 📌 Get All Complaints
@app.get("/complaints/")
async def get_complaints():
    try:
        complaints = list(collection.find({}, {
            "_id": 1, "location": 1, "description": 1,
            "category": 1, "status": 1, "image_url": 1,
            "user": 1, "coordinates": 1
        }))
        for complaint in complaints:
            complaint["_id"] = str(complaint["_id"])
        return {"complaints": complaints}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    
# --------------------------------------------------
# 📌 3️⃣ GET COMPLAINTS FOR A SPECIFIC USER
# --------------------------------------------------
@app.get("/complaints/user/{email}")
async def get_user_complaints(email: str):
    try:
        user_complaints = list(collection.find({"user": email}))
        for complaint in user_complaints:
            complaint["_id"] = str(complaint["_id"])
        return {"complaints": user_complaints}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user complaints: {str(e)}")

# --------------------------------------------------
# 📌 4️⃣ GEMINI CHATBOT
# --------------------------------------------------
@app.post("/chatbot/chat")
async def chatbot(message: str = Form(...)):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content([message])
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in chatbot: {str(e)}")


# --------------------------------------------------
# 📌 5️⃣ GET ENHANCED TECHNIQUES FROM FILE
# --------------------------------------------------
@app.get("/techniques")
def get_techniques():
    """Returns pre-scraped and enhanced techniques from file."""
    print("In the /techniques endpoint")
    try:
        # Resolve the absolute path of the JSON file
        file_path = os.path.join(os.path.dirname(__file__), "scraping/data/processed_data/techniques.json")
        
        if not os.path.exists(file_path):
            print(f"Path does not exist: {file_path}")
            raise HTTPException(status_code=404, detail=f"Data not found at {file_path}.")
        
        if os.stat(file_path).st_size == 0:
            print(f"File is empty: {file_path}")
            raise HTTPException(status_code=500, detail="JSON file is empty.")
        
        with open(file_path, "r") as f:
            print("Reading the file")
            try:
                data = json.load(f)
            except json.JSONDecodeError as e:
                print(f"JSON Decode Error: {e}")
                raise HTTPException(status_code=500, detail=f"Invalid JSON format: {str(e)}")
        
        return {"techniques": data}
    except Exception as e:
        print(f"Error in get_techniques: {e}")
        raise HTTPException(status_code=500, detail=f"Error loading techniques: {str(e)}")

# --------------------------------------------------
# 📌 6️⃣ SCRAPE NOW - ONLY ON DEMAND
# --------------------------------------------------
@app.post("/scrape-now")
def scrape_now():
    """Triggers scraping + enhancement. Updates the local JSON file."""
    try:
        run_scraping_pipeline()
        return {"status": "success", "message": "Scraping and processing completed."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")
    

# 📌 5️⃣ DELETE ALL COMPLAINTS (For Development Purposes)
@app.delete("/complaints/delete-all/")
async def delete_all_complaints():
    try:
        result = collection.delete_many({})
        return {"message": f"Deleted {result.deleted_count} complaints."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting complaints: {str(e)}")


 # Reverse Geocoding Endpoint (using an example API like Nominatim) 
@app.get("/api/geocode/reverse")
async def reverse_geocode(lat: float, lon: float):
    # External geocoding service URL (this example uses Nominatim API for OpenStreetMap)
    url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=503, detail="Geocoding service is unavailable")

    return response.json()

# Directions Endpoint (Using OpenRouteService API as an example)
@app.get("/api/directions")
async def get_directions(start_lat: float, start_lon: float, end_lat: float, end_lon: float):
    # Example API endpoint for directions (OpenRouteService or Google Maps Directions)
    url = f"https://api.openrouteservice.org/v2/directions/driving-car?api_key=your_api_key&start={start_lon},{start_lat}&end={end_lon},{end_lat}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=503, detail="Directions service is unavailable")

    return response.json()
# Create a mock data model for rainfall data
ctechniques_data = {
    "Rainwater Harvesting": [
        "Rainwater harvesting for household use",
        "Rainwater harvesting for irrigation",
    ],
    "Groundwater Recharge": [
        "Recharge pits for groundwater enhancement",
        "Check dams for groundwater recharge",
    ],
    "Afforestation": [
        "Forest restoration programs",
        "Tree plantation on barren land",
    ],
}

# Create a mock data model for rainfall data
class RainfallData(BaseModel):
    latitude: float
    longitude: float
    annual_rainfall: float

# Example of rainfall data (with latitude, longitude, and rainfall)
rainfall_data = [
    {"latitude": 12.9794048, "longitude": 77.594624, "annual_rainfall": 1000},
    {"latitude": 28.704060, "longitude": 77.102493, "annual_rainfall": 800},
    {"latitude": 19.076090, "longitude": 72.877426, "annual_rainfall": 1200},
]

@app.get("/rainfall")
async def get_rainfall(lat: float, lon: float):
    # Look for a matching entry based on latitude and longitude
    for entry in rainfall_data:
        if entry['latitude'] == lat and entry['longitude'] == lon:
            return {"annual_rainfall": entry['annual_rainfall']}
    
    # If no match, return 404 not found
    raise HTTPException(status_code=404, detail="Rainfall data not found for this location.")


# This route suggests conservation techniques based on rainfall amount
@app.get("/techniques/suggestions")
async def get_suitable_techniques(annual_rainfall: float):
    if annual_rainfall > 1000:
        # High rainfall: Suggest Rainwater Harvesting and Afforestation
        return {"suggested_techniques": techniques_data["Rainwater Harvesting"] + techniques_data["Afforestation"]}
    elif annual_rainfall < 800:
        # Low rainfall: Suggest Groundwater Recharge
        return {"suggested_techniques": techniques_data["Groundwater Recharge"]}
    else:
        # Moderate rainfall: Suggest a combination of techniques
        return {"suggested_techniques": techniques_data["Rainwater Harvesting"] + techniques_data["Groundwater Recharge"]}



# ✅ MAIN ENTRY
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
