import random
import time

def process_with_gemini(techniques):
    # Simulate processing techniques with Gemini
    processed_techniques = []
    
    # Log the start time of processing
    start_time = time.time()

    for technique in techniques:
        # Simulate some processing (e.g., ranking or additional filtering)
        
        # Example of adding a score based on a random factor (this could be more complex)
        technique_score = random.uniform(0, 10)
        technique["score"] = round(technique_score, 2)  # Assigning a random score

        # Additional filtering based on the score (e.g., discard techniques with a score < 5)
        if technique_score < 5:
            technique["processed"] = False
            technique["reason"] = "Low suitability"
            continue  # Skip this technique as it's not suitable
        
        # Add metadata to the technique
        technique["processed"] = True
        technique["processing_time"] = round(random.uniform(0.1, 1.5), 2)  # Simulated time taken for processing
        technique["processed_date"] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())  # Current time

        # Simulating additional filtering based on a random factor (could be anything)
        if random.choice([True, False]):
            technique["note"] = "Sustainability factor applied"
        
        # Add the processed technique to the list
        processed_techniques.append(technique)
    
    # Log the end time and calculate duration of processing
    end_time = time.time()
    processing_duration = round(end_time - start_time, 2)

    # Optional: Log how long processing took
    print(f"Processed {len(techniques)} techniques in {processing_duration} seconds.")

    return processed_techniques
