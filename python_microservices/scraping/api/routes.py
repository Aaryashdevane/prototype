from fastapi import APIRouter
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# Fetch API URLs from environment variables
APIFY_POSTS_API = os.getenv("APIFY_POSTS_API")
APIFY_TWITTER_POSTS_API = os.getenv("APIFY_TWITTER_POSTS_API")

@router.get("/posts")
def get_all_posts():
    # Fetch data from the external API
    try:
        response = requests.get(APIFY_POSTS_API)
        response.raise_for_status()  # Raise an error for HTTP errors
        data = response.json()  # Parse the JSON response
    except requests.RequestException as e:
        return {"error": f"Failed to fetch data from API: {str(e)}"}

    # Extract and normalize the data
    all_posts = []
    try:
        top_posts = data[1]["topPosts"]  # Access the second index and its "topPosts"
        for post in top_posts:
            # Extract required fields
            media = None
            if post.get("type") == "Video":
                media = post.get("videoUrl")
            elif post.get("type") == "Sidecar":
                media = post.get("displayUrl")  # Get the first image if available
            elif post.get("type") == "Image":
                media = post.get("displayUrl")

            normalized_post = {
                "id": post.get("id"),
                "type": post.get("type"),
                "caption": post.get("caption"),
                "media": media,
                "url": post.get("url")  # Include the URL field
            }
            all_posts.append(normalized_post)
    except (IndexError, KeyError) as e:
        return {"error": f"Failed to process data: {str(e)}"}

    return {"posts": all_posts}

@router.get("/twitter-posts")
def twitter_all_posts():
    # Fetch data from the external API
    try:
        response = requests.get(APIFY_TWITTER_POSTS_API)
        response.raise_for_status()  # Raise an error for HTTP errors
        data = response.json()  # Parse the JSON response
    except requests.RequestException as e:
        return {"error": f"Failed to fetch data from API: {str(e)}"}

    # Extract and normalize the data
    all_posts = []
    try:
        for post in data:  # Iterate through the JSON data
            # Extract media URL from extendedEntities.media
            media_url_https = None
            if "extendedEntities" in post and "media" in post["extendedEntities"]:
                media_items = post["extendedEntities"]["media"]
                if media_items and isinstance(media_items, list):
                    media_url_https = media_items[0].get("media_url_https")  # Get the first media URL

            # Normalize the post
            normalized_post = {
                "id": post.get("id"),
                "type": post.get("type"),
                "url": post.get("url"),
                "fullText": post.get("fullText"),
                "author": {
                    "userName": post.get("author", {}).get("userName"),
                    "name": post.get("author", {}).get("name"),
                    "profilePicture": post.get("author", {}).get("profilePicture"),
                },
                "media_url_https": media_url_https,
            }
            all_posts.append(normalized_post)
    except (KeyError, TypeError) as e:
        print(f"Error processing data: {str(e)}")

    return {"posts": all_posts}
