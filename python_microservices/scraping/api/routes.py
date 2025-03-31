from fastapi import APIRouter
from services import ingest

router = APIRouter()

@router.get("/posts")
def get_all_posts():
    images = ingest.fetch_google_images()
    videos = ingest.fetch_google_videos()
    projects = ingest.fetch_project_links()
    reddit = ingest.fetch_reddit_posts()

    all_posts = []

    # Normalize Google Images
    for img in images:
        all_posts.append({
            "source": "Google Images",
            "title": img["title"],
            "media": img["local_image_path"],
            "url": img["image_url"],
            "type": "image"
        })

    # Normalize Videos
    for vid in videos:
        all_posts.append({
            "source": "Google Videos",
            "title": vid["title"],
            "url": vid["video_url"],
            "type": "video"
        })

    # Normalize Project Links
    for proj in projects:
        all_posts.append({
            "source": "Gov/Org Projects",
            "title": proj["title"],
            "url": proj["link"],
            "type": "link"
        })

    # Normalize Reddit
    for post in reddit:
        all_posts.append({
            "source": "Reddit",
            "title": post["title"],
            "url": post["permalink"],
            "type": "reddit"
        })

    return {"posts": all_posts}
