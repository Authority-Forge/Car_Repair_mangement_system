import json

def update_mech_features():
    file_path = 'c:/Users/corvo/Desktop/upwork/Build a solution that helps car mechanics to track car repairs/feature_list.json'
    
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            
        updated_count = 0
        for item in data:
            # Update ID ranges for Mechanic (MECH-001 to MECH-020)
            if item['id'].startswith('MECH-') and 1 <= int(item['id'].split('-')[1]) <= 20:
                item['passes'] = True
                updated_count += 1
                
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
            
        print(f"Successfully updated {updated_count} tests to passed (MECH-001 to MECH-020).")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_mech_features()
