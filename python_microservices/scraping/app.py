from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router  # your existing router import

app = FastAPI()

# Add CORS middleware here
origins = [
    "http://localhost:5173",  # Your React dev server
    # "https://your-production-domain.com" (add this when you deploy)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routes
app.include_router(api_router)
