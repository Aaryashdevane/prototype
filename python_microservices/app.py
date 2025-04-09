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

# 📌 Scraping runner
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

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change this if frontend is deployed elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# 📌 1️⃣ IMAGE PROCESSING SERVICE
# --------------------------------------------------
@app.post("/process-image/")
async def process_image(
    file: UploadFile = File(...),
    location: str = Form(...),
    user: str = Form(...)
):
    try:
        cloudinary_response = cloudinary.uploader.upload(file.file)
        image_url = cloudinary_response.get("secure_url")

        if not image_url:
            raise HTTPException(status_code=500, detail="Failed to upload image to Cloudinary.")

        response = requests.get(image_url)
        response.raise_for_status()
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
            "user": user
        }
        inserted_id = collection.insert_one(complaint_data).inserted_id

        return {
            "message": "Complaint submitted successfully!",
            "id": str(inserted_id),
            "description": description,
            "category": category,
            "image_url": image_url
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

# --------------------------------------------------
# 📌 2️⃣ GET ALL COMPLAINTS
# --------------------------------------------------
@app.get("/complaints/")
async def get_complaints():
    try:
        complaints = list(collection.find({}, {
            "_id": 1, "location": 1, "description": 1,
            "category": 1, "status": 1, "image_url": 1, "user": 1
        }))
        for complaint in complaints:
            complaint["_id"] = str(complaint["_id"])
        return {"complaints": complaints}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving complaints: {str(e)}")

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
    try:
        file_path = "scraping/data/processed_data/techniques.json"
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Data not found.")
        with open(file_path, "r") as f:
            data = json.load(f)
        return {"techniques": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading techniques: {str(e)}")
    
# --------------------------------------------------
# 📌 8️⃣ GET SCRAPED POSTS (for frontend feed)
# --------------------------------------------------
@app.get("/posts")
def get_scraped_posts():
    """Returns all scraped social media / external posts."""
    try:
        file_path = "scraping/data/processed_data/techniques.json"
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Scraped posts not found.")
        with open(file_path, "r") as f:
            data = json.load(f)
        return data  # assuming it's a list of posts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading posts: {str(e)}")


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

# --------------------------------------------------
# 📌 7️⃣ DELETE ALL COMPLAINTS
# --------------------------------------------------
@app.delete("/complaints/delete-all/")
async def delete_all_complaints():
    try:
        result = collection.delete_many({})
        return {"message": f"Deleted {result.deleted_count} complaints."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting complaints: {str(e)}")

# ✅ MAIN ENTRY
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
