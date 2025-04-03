from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Body
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

# Load environment variables
load_dotenv()

# Configure Google Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("❌ Missing GEMINI_API_KEY environment variable!")
genai.configure(api_key=GEMINI_API_KEY)

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["complaints_db"]  # Database name
collection = db["complaints"]  # Collection name

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust for frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 📌 1️⃣ IMAGE PROCESSING SERVICE
@app.post("/process-image/")
async def process_image(
    file: UploadFile = File(...),
    location: str = Form(...),
    user: str = Form(...)  # ✅ Capture user email
):
    """Processes an uploaded image, categorizes it, and stores the complaint in MongoDB."""
    try:
        # Upload Image to Cloudinary
        cloudinary_response = cloudinary.uploader.upload(file.file)
        image_url = cloudinary_response.get("secure_url")

        if not image_url:
            raise HTTPException(status_code=500, detail="Failed to upload image to Cloudinary.")

        # Download image from Cloudinary for Gemini processing
        try:
            response = requests.get(image_url)
            response.raise_for_status()
            image = PIL.Image.open(BytesIO(response.content))
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=f"Failed to download image from Cloudinary: {str(e)}")

        # Process Image with Google Gemini
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content([image, "Describe this image in detail."])
        description = response.text if response.text else "No description available"

        # Categorize Image
        category = categorize(description)

        # Store Complaint Data in MongoDB
        complaint_data = {
            "location": location,
            "description": description,
            "category": category,
            "image_url": image_url,
            "status": "Pending",
            "user": user  # ✅ Store the user's email
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


# 📌 2️⃣ RETRIEVE ALL COMPLAINTS
@app.get("/complaints/")
async def get_complaints():
    """Retrieves all complaints for municipal corporation dashboard."""
    try:
        complaints = list(collection.find({}, {"_id": 1, "location": 1, "description": 1, "category": 1, "status": 1, "image_url": 1, "user": 1}))
        
        # Convert MongoDB ObjectId to string
        for complaint in complaints:
            complaint["_id"] = str(complaint["_id"])

        return {"complaints": complaints}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving complaints: {str(e)}")


# 📌 3️⃣ RETRIEVE COMPLAINTS FOR A SPECIFIC USER
@app.get("/complaints/user/{email}")
async def get_user_complaints(email: str):
    """Retrieves complaints for a specific user based on their email."""
    try:
        user_complaints = list(collection.find({"user": email}))  # ✅ Query using exact match

        if not user_complaints:
            return {"complaints": []}  # ✅ Return empty array instead of throwing error

        # Convert MongoDB ObjectId to string
        for complaint in user_complaints:
            complaint["_id"] = str(complaint["_id"])

        return {"complaints": user_complaints}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user complaints: {str(e)}")


# 📌 4️⃣ CHATBOT SERVICE (USING GEMINI API)
@app.post("/chatbot/chat")
async def chatbot(message: str = Form(...)):
    """Handles user queries and returns AI response."""
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content([message])
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in chatbot: {str(e)}")


# 📌 5️⃣ DELETE ALL COMPLAINTS (For Development Purposes)
@app.delete("/complaints/delete-all/")
async def delete_all_complaints():
    """Deletes all complaints from the database."""
    try:
        result = collection.delete_many({})
        return {"message": f"Deleted {result.deleted_count} complaints."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting complaints: {str(e)}")


# ✅ MAIN ENTRY POINT
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
