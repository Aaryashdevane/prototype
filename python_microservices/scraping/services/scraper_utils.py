import os
import requests

def download_file(url, save_dir="data/downloads"):
    """Download image/video from URL and save locally."""
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
