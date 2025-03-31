import os
import json
import csv
from serpapi import GoogleSearch
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

# 🔹 Search Queries
QUERIES = [
    "Water conservation projects site:*.gov OR site:*.org OR site:researchgate.net",
    "Rainwater harvesting projects site:*.edu OR site:researchgate.net",
    "Sustainable irrigation projects site:worldbank.org OR site:un.org",
    "Groundwater recharge projects site:*.gov OR site:*.org",
    "Wastewater treatment innovations site:researchgate.net OR site:sciencedirect.com",
    "Desalination technology projects site:*.gov OR site:sciencedirect.com"
]

# 🔹 Fetch Projects from Google
def fetch_google_projects():
    project_list = []

    for query in QUERIES:
        print(f"🔍 Searching: {query}")

        params = {
            "q": query,
            "hl": "en",
            "gl": "us",
            "api_key": SERPAPI_KEY
        }

        search = GoogleSearch(params)
        results = search.get_dict()

        for result in results.get("organic_results", []):
            project_list.append({
                "title": result.get("title", "No Title"),
                "snippet": result.get("snippet", "No Description"),
                "link": result.get("link", "No Link")
            })

    return project_list

# 🔹 Save to JSON
def save_to_json(projects, filename="data/projects.json"):
    os.makedirs("data", exist_ok=True)
    with open(filename, "w", encoding="utf-8") as file:
        json.dump(projects, file, indent=4)
    print(f"✅ Data saved to {filename}")

# 🔹 Save to CSV
def save_to_csv(projects, filename="data/projects.csv"):
    os.makedirs("data", exist_ok=True)
    with open(filename, "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=["title", "snippet", "link"])
        writer.writeheader()
        writer.writerows(projects)
    print(f"✅ Data saved to {filename}")

# 🔹 Run as script
if __name__ == "__main__":
    projects = fetch_google_projects()
    save_to_json(projects)
    save_to_csv(projects)
