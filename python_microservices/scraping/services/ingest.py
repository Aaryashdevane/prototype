import os
import json
import requests
import praw
# from serpapi import GoogleSearch
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Keys
SERPAPI_KEY = os.getenv("SERPAPI_KEY")
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT")

# Utility: Download media (images/videos)
def download_file(url, save_dir="downloads"):
    """Download an image or video from a URL."""
    if not url:
        return None
    os.makedirs(save_dir, exist_ok=True)
    filename = os.path.join(save_dir, url.split("/")[-1].split("?")[0])
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(filename, "wb") as file:
            for chunk in response.iter_content(1024):
                file.write(chunk)
        return filename
    return None

# Google Image Scraper
def fetch_google_images(query="Water Conservation", num_results=5):
    """Fetch images from Google using SerpAPI."""
    search_params = {
        "q": query,
        "tbm": "isch",
        "api_key": SERPAPI_KEY
    }
    search = GoogleSearch(search_params)
    results = search.get_dict()
    images = results.get("images_results", [])
    result = []
    for img in images[:num_results]:
        img_url = img.get("original")
        img_path = download_file(img_url) if img_url else None
        result.append({
            "title": query,
            "image_url": img_url,
            "local_image_path": img_path
        })
    return result

# Google Video Scraper (YouTube, etc.)
def fetch_google_videos(query="Water Conservation", num_results=5):
    """Fetch YouTube or other video links related to Water Conservation."""
    search_params = {
        "q": query,
        "tbm": "vid",
        "api_key": SERPAPI_KEY
    }
    search = GoogleSearch(search_params)
    results = search.get_dict()
    videos = results.get("video_results", [])
    result = []
    for vid in videos[:num_results]:
        result.append({
            "title": vid.get("title"),
            "video_url": vid.get("link")
        })
    return result

# Google Search for project links (gov/org)
def fetch_project_links(query="Water Conservation projects site:gov OR site:org", num_results=5):
    """Fetch project links from .gov or .org domains."""
    params = {"q": query, "api_key": SERPAPI_KEY}
    search = GoogleSearch(params)
    results = search.get_dict()
    projects = results.get("organic_results", [])
    return [{"title": proj.get("title"), "link": proj.get("link")} for proj in projects[:num_results]]

# Reddit Scraper
def fetch_reddit_posts(subreddit="waterconservation", query="Water Conservation", limit=5):
    """Fetch posts from Reddit related to Water Conservation."""
    reddit = praw.Reddit(
        client_id=REDDIT_CLIENT_ID,
        client_secret=REDDIT_CLIENT_SECRET,
        user_agent=REDDIT_USER_AGENT,
    )
    subreddit_obj = reddit.subreddit(subreddit)
    posts = subreddit_obj.search(query, limit=limit)
    result = []
    for post in posts:
        result.append({
            "title": post.title,
            "score": post.score,
            "url": post.url,
            "permalink": f"https://reddit.com{post.permalink}",
            "created_utc": post.created_utc
        })
    return result

# Save utilities
def save_to_json(data, filename):
    os.makedirs("data", exist_ok=True)
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)
    print(f"✅ Data saved to {filename}")

# Optional test entry point (can be removed in prod)
if __name__ == "__main__":
    images = fetch_google_images()
    save_to_json(images, "data/google_images.json")

    videos = fetch_google_videos()
    save_to_json(videos, "data/google_videos.json")

    projects = fetch_project_links()
    save_to_json(projects, "data/google_projects.json")

    reddit_posts = fetch_reddit_posts()
    save_to_json(reddit_posts, "data/reddit_posts.json")
