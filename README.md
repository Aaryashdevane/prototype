

# **Water Conservation System 🌊**  
A web-based platform to report water wastage, raise awareness, and provide conservation techniques using **AI-powered analysis, image processing, and chatbot assistance**.

---

## **🌟 Features**
✅ **User-Friendly Web App** – Built using React.js & FastAPI  
✅ **Water Wastage Complaint System** – Users can submit complaints with images  
✅ **AI-Powered Image Processing** – Classifies complaints using **Google Gemini AI**  
✅ **Smart Chatbot (AquaBot) 🤖** – Answers water conservation queries using **Gemini API**  
✅ **Municipal & NGO Dashboards** – Authorities can manage and track complaints  
✅ **Water Conservation Techniques** – Provides tips & solutions for saving water  
✅ **Subsidy & Schemes Information** – Helps users access government schemes  

---

## **🛠 Tech Stack**
### **Frontend (User Interface)**
- React.js, Vite.js  
- Tailwind CSS, Framer Motion (Animations)  

### **Backend (API & Processing)**
- **FastAPI** (Python)  
- MongoDB (Database for storing complaints)  
- Cloudinary (Image Uploads)  
- Google Gemini API (AI Image & Chat Processing)  

### **Microservices Architecture**
- **Chatbot** (Gemini-powered assistant)  
- **Image Processing** (AI-based classification of complaints)  
- **Scraping** (Fetching conservation data & schemes)  

---

## **📂 Project Structure**
```
WaterConservation/
│── backend/                   # Backend API (Node.js)
│── frontend/                  # Frontend (React.js)
│── python_microservices/      # Python Microservices (FastAPI)
│   ├── chatbot/               # Chatbot service
│   ├── image_processing/      # AI-powered complaint classification
│   ├── scraping/              # Data collection service
│── .gitignore
│── requirements.txt           # Python dependencies
│── package.json               # Frontend dependencies
│── app.py                     # FastAPI entry point for microservices
│── README.md                  # Project Documentation
```

---

## **🚀 Setup & Installation**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/Aaryashdevane/prototype.git
cd prototype/WaterConservation
```

### **2️⃣ Install Python Dependencies**
```sh
pip install -r requirements.txt
```

### **3️⃣ Install Frontend Dependencies**
```sh
cd frontend
npm install
```

### **4️⃣ Configure Environment Variables**
Create a `.env` file in the root and add:  
```
GEMINI_API_KEY=your_gemini_api_key
MONGO_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### **5️⃣ Run Backend (FastAPI)**
```sh
cd python_microservices
uvicorn app:app --reload
```

### **6️⃣ Run Frontend (React)**
```sh
cd frontend
npm run dev
```

---

## **🛡 API Endpoints**
### **Image Processing Service**
- `POST /process-image/` → Uploads & categorizes a complaint image
- `GET /complaints/` → Fetches all reported complaints
- `PATCH /update-status/{id}` → Updates complaint status  

### **Chatbot Service**
- `POST /chat/` → Asks the AquaBot a question  

---

## **📜 Contributing**
Want to improve this project? Follow these steps:  
1. **Fork** the repo  
2. **Create a new branch** (`git checkout -b feature-name`)  
3. **Commit your changes** (`git commit -m "Added new feature"`)  
4. **Push** to your branch (`git push origin feature-name`)  
5. Open a **Pull Request** 🚀  

---

## **📬 Contact & Support**
💡 If you have any questions or issues, feel free to reach out:  
📧 Email: `your.email@example.com`  
🐙 GitHub: [Aaryashdevane](https://github.com/Aaryashdevane)  

Happy Coding! 🚀💙

---
