import os
import json
from dotenv import load_dotenv
# from scraping.gemini_processor import process_with_gemini

# Load .env variables
load_dotenv()
def run_scraping_pipeline():
    from scraping.gemini_processor import process_with_gemini

    DATA_FILES = ["scraping/best_practices.json", "scraping/extended_data.json", "scraping/schemes.json"]
    OUTPUT_FILE = "scraping/techniques.json"

    final_data = []

    for file_path in DATA_FILES:
        if not os.path.exists(file_path):
            print(f"⚠️ Skipping missing file: {file_path}")
            continue

        with open(file_path, 'r') as f:
            try:
                if file_path.endswith(".json"):
                    items = json.load(f)
                else:
                    continue
            except Exception as e:
                print(f"❌ Error reading file {file_path}: {e}")
                continue

            source = os.path.basename(file_path).replace('.json', '')
            for item in items:
                try:
                    result = process_with_gemini(item, source)
                    if result:
                        final_data.append(result)
                except Exception as e:
                    print(f"❌ Error processing item from {file_path}: {e}")

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(final_data, f, indent=2)

    print("✅ Data saved to", OUTPUT_FILE)