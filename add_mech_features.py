import json

def add_mech_features():
    file_path = 'c:/Users/corvo/Desktop/upwork/Build a solution that helps car mechanics to track car repairs/feature_list.json'
    
    new_features = []
    
    # MECH-001 to MECH-020 scaffolding
    for i in range(1, 21):
        feature_id = f"MECH-{i:03d}"
        new_features.append({
            "id": feature_id,
            "feature": "Mechanic Dashboard",
            "category": "Backend" if i <= 4 else ("Integration" if i <= 8 else ("Frontend" if i <= 12 else "E2E")),
            "type": "Backend" if i <= 8 else "Frontend",
            "description": f"Placeholder for {feature_id}",
            "steps": ["Step 1", "Step 2"],
            "passes": False
        })

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            
        # Check if already exists to avoid dupes
        existing_ids = {item['id'] for item in data}
        to_add = [item for item in new_features if item['id'] not in existing_ids]
        
        data.extend(to_add)
                
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
            
        print(f"Added {len(to_add)} MECH features.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    add_mech_features()
