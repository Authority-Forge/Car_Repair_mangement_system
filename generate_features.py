import json

# Output file
OUTPUT_FILE = "feature_list.json"

# Features from PRD
FEATURES = {
    "Auth": ["Login", "Register", "Role Guards", "Session Management", "Password Reset"],
    "MechanicDashboard": ["Metrics Calculation", "Active Jobs List", "Job Filtering", "Status Updates", "Notifications"],
    "JobDetails": ["Workflow Transitions", "Work Records (Parts/Labor)", "Cost Calculations", "Internal Comments", "Public Comments"],
    "CustomerPortal": ["Dashboard Overview", "My Garage List", "Add Vehicle", "Invoice List", "Support Ticket"],
    "VehicleManagement": ["Create Vehicle", "Update Vehicle", "Search by VIN", "Vehicle History", "Archive Vehicle"]
}

# Categories
CATEGORIES = [
    "Backend Unit",
    "Backend Integration",
    "Frontend Unit",
    "E2E",
    "Security & Edge Case"
]

# Templates for test generation
TEMPLATES = {
    "Backend Unit": [
        "Validate {subfeature} input with strict Zod schema",
        "Handle invalid {subfeature} data gracefully",
        "Ensure {subfeature} logic returns correct entity",
        "Mock repository for {subfeature} success",
        "Mock repository for {subfeature} failure",
        "Check {subfeature} business rule A",
        "Check {subfeature} business rule B",
        "Validate {subfeature} DTO transformation",
        "Ensure {subfeature} handles null values",
        "Verify {subfeature} data formatting",
        "Verify {subfeature} boundary value analysis",
        "Check {subfeature} exact character limit logic",
        "Validate {subfeature} empty string handling",
        "Ensure {subfeature} numeric overflow protection",
        "Check {subfeature} unicode character support",
        "Verify {subfeature} boolean logic gates",
        "Check {subfeature} case sensitivity handling",
        "Validate {subfeature} invalid enum values",
        "Ensure {subfeature} handles undefined inputs",
        "Check {subfeature} date format validation"
    ],
    "Backend Integration": [
        "POST/GET {subfeature} endpoint returns 200 OK",
        "POST/GET {subfeature} endpoint returns 400 on bad data",
        "Database persists {subfeature} correctly",
        "Relations are preserved in {subfeature}",
        "Transaction passes for {subfeature} flow",
        "Rollback occurs on {subfeature} error",
        "Middleware authenticates {subfeature} request",
        "Response body matches {subfeature} Zod schema",
        "Headers are correct for {subfeature}",
        "Performance acceptable for {subfeature}",
        "Concurrent {subfeature} requests handled correctly",
        "Rate limiter triggers for {subfeature}",
        "Idempotency check for {subfeature}",
        "Cache invalidation triggers on {subfeature}",
        "Database constraints prevent duplicate {subfeature}",
        "Orphaned records prevented in {subfeature}",
        "Soft delete works for {subfeature}",
        "Audit logs created for {subfeature}",
        "CORS headers correct for {subfeature}",
        "Timeout handling for {subfeature}"
    ],
    "Frontend Unit": [
        "Render {subfeature} component without crashing",
        "Validate {subfeature} form fields with Zod",
        "Display error message for invalid {subfeature} input",
        "Button state changes on {subfeature} interaction",
        "Mock API call for {subfeature} success",
        "Mock API call for {subfeature} error",
        "Component props validate against {subfeature} schema",
        "Loading state shown during {subfeature}",
        "Success toast appears after {subfeature}",
        "Accessibility tags present in {subfeature}",
        "Component unmounts cleanly for {subfeature}",
        "Rerender is efficient for {subfeature}",
        "Theme change handled in {subfeature}",
        "Mobile viewport responsive for {subfeature}",
        "Tablet viewport responsive for {subfeature}",
        "Keyboard navigation works in {subfeature}",
        "Focus management correct in {subfeature}",
        "Tooltip appears on hover in {subfeature}",
        "Long text triggers truncation in {subfeature}",
        "Empty state rendered for {subfeature}"
    ],
    "E2E": [
        "User can complete {subfeature} flow successfully",
        "User sees updated data after {subfeature}",
        "Navigation to {subfeature} page works",
        "Browser history maintained in {subfeature}",
        "Refresh on {subfeature} page retains state",
        "Mobile layout renders {subfeature} correctly",
        "Desktop layout renders {subfeature} correctly",
        "Form submission works for {subfeature}",
        "Cancel action works in {subfeature}",
        "Logout during {subfeature} redirects to login",
        "Back button works in {subfeature} flow",
        "Deep link to {subfeature} works",
        "Offline mode behavior for {subfeature}",
        "Session timeout handling in {subfeature}",
        "Multi-tab sync for {subfeature}",
        "Performance metrics (LCP/FID) for {subfeature}",
        "Error boundary catches {subfeature} crash",
        "Analytics event fired for {subfeature}",
        "Cookie consent interaction in {subfeature}",
        "localization/i18n check for {subfeature}"
    ],
    "Security & Edge Case": [
        "SQL Injection attempt on {subfeature} fails",
        "XSS payload in {subfeature} input sanitized",
        "Unauthorized user cannot access {subfeature}",
        "Rate limiting triggers on {subfeature} spam",
        "Large payload handled by {subfeature}",
        "Concurrent requests to {subfeature} handled",
        "Invalid content-type rejected by {subfeature}",
        "Expired token denied for {subfeature}",
        "CSRF token validated for {subfeature}",
        "Sensitive data masked in {subfeature} logs",
        "NULL byte injection fails on {subfeature}",
        "Path traversal attempt fails on {subfeature}",
        "HTTP Parameter Pollution fails on {subfeature}",
        "Replay attack fails on {subfeature}",
        "Timing attack mitigation for {subfeature}",
        "Broken Object Level Authorization (BOLA) check {subfeature}",
        "Mass assignment protection for {subfeature}",
        "Improper Assets Management check {subfeature}",
        "Insufficient Logging check {subfeature}",
        "SSRF protection for {subfeature}"
    ]
}

def generate_steps(category, subfeature, specific_desc):
    """
    Generates plausible steps based on category.
    """
    if "Backend Unit" in category:
        return [
            f"Mock Repository/Service dependencies for {subfeature}",
            f"Call function with test data for {specific_desc}",
            f"Assert return value expectation",
            f"Verify Zod schema validation for inputs"
        ]
    elif "Integration" in category:
        return [
            f"Seed database with prerequisites for {subfeature}",
            f"Send HTTP request to endpoint related to {subfeature}",
            f"Assert response status and body",
            f"Verify database state change"
        ]
    elif "Frontend" in category:
        return [
            f"Render component associated with {subfeature}",
            f"Simulate user interaction (click/type)",
            f"Assert UI updates (text/color/visibility)",
            f"Verify Zod client-side validation triggers"
        ]
    elif "E2E" in category:
        return [
            f"Navigate to {subfeature} page via UI",
            f"Perform full user workflow for {specific_desc}",
            f"Verify persistence across screens",
            f"Check final state in UI"
        ]
    else: # Security
        return [
            f"Attempt malicious input/action on {subfeature}",
            f"Verify system rejects/sanitizes input",
            f"Assert 403/401 or clean output",
            f"Check logs for security alert (optional)"
        ]

def main():
    test_list = []
    
    # We want 100 tests per Feature (Auth, MechanicDashboard...)
    # There are 5 Main Features.
    # Each Main Feature has 5 Subfeatures.
    # We will generate 4 tests per Category per Subfeature.
    # 5 Categories * 4 tests = 20 tests per Subfeature.
    # 20 * 5 Subfeatures = 100 tests per Main Feature.
    
    overall_id_counter = 1
    
    for feature_name, subfeatures in FEATURES.items():
        feature_prefix = feature_name[:4].upper()
        
        for sub in subfeatures:
            for category in CATEGORIES:
                # Pick first 4 templates 
                selected_templates = TEMPLATES[category][:4] 
                
                for idx, template in enumerate(selected_templates):
                    desc = template.format(subfeature=sub)
                    steps = generate_steps(category, sub, desc)
                    
                    test_item = {
                        "id": f"{feature_prefix}-{overall_id_counter:03d}",
                        "feature": feature_name,
                        "category": category,
                        "type": category.split(" ")[0], 
                        "description": desc,
                        "steps": steps,
                        "passes": False
                    }
                    test_list.append(test_item)
                    overall_id_counter += 1

    # Write to file
    with open(OUTPUT_FILE, "w") as f:
        json.dump(test_list, f, indent=2)
    
    print(f"Generated {len(test_list)} tests in {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
