import json
import geopy.distance  # You may need to install geopy for distance calculations

def get_rainfall(latitude, longitude):
    try:
        # Load the rainfall data from the JSON file
        with open('data/rainfall_data.json', 'r') as f:
            rainfall_data = json.load(f)
        
        if not rainfall_data:
            raise ValueError("Rainfall data is empty or invalid.")
        
        closest_match = None
        min_distance = float('inf')  # Initialize with a large value

        # Loop through the rainfall data to find the closest match
        for entry in rainfall_data:
            # Calculate the distance between the provided coordinates and the current entry's coordinates
            entry_coords = (entry['latitude'], entry['longitude'])
            user_coords = (latitude, longitude)
            distance = geopy.distance.distance(user_coords, entry_coords).km  # Distance in kilometers
            
            if distance < min_distance:
                min_distance = distance
                closest_match = entry
        
        # Return the annual rainfall for the closest match if found
        if closest_match:
            return {
                "annual_rainfall": closest_match['annual_rainfall'],
                "location": closest_match.get('location_name', 'Unknown Location'),
                "distance_km": min_distance
            }
        
        # If no matching entry found, return a suitable message
        return {"error": "No matching location found based on the provided coordinates."}
    
    except FileNotFoundError:
        return {"error": "Rainfall data file not found."}
    
    except json.JSONDecodeError:
        return {"error": "Failed to decode JSON data from the rainfall data file."}
    
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}
