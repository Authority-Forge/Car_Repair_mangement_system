# Screen Specification: Add Vehicle Screen

## Overview
A form-based screen for customers to register a new vehicle in their garage.

## Visual Design
*   **Theme**: Light/Dark mode supported.
*   **Layout**: Centered form container with "Back to Garage" link.

## UI Components

### Header
*   **Brand**: "AutoFix Garage" + Icon.
*   **Nav**: Standard Customer Nav (Dashboard, My Vehicles, Invoices, Support).
*   **User Profile**: Notifications, Name, Avatar.

### Main Content
*   **Navigation**: "Back to Garage" link (`arrow_back`).
*   **Card Header**: "Add New Vehicle" + Subtext.
*   **Form**:
    1.  **Vehicle Photo**: Drag & Drop upload area with `add_a_photo` icon.
    2.  **Make**: Dropdown (Select Make).
    3.  **Model**: Text Input (e.g., Camry).
    4.  **Year**: Dropdown (Select Year).
    5.  **License Plate**: Text Input (Uppercase, Monospace font).
    6.  **VIN**: Text Input with `qr_code_scanner` icon (Tooltip "Scan VIN"). Helper text explaining location.
*   **Actions**:
    *   **Cancel**: Secondary button.
    *   **Add Vehicle**: Primary button (`add` icon).

## Interactions
*   **Photo Upload**: Triggers file selection dialog.
*   **Form Submission**: Validates required fields (*Make, Model, Year*) and POSTs data.
*   **Cancel**: Navigates back to My Garage.

## Assets
*   **Icons**: Material Symbols (`add_a_photo`, `qr_code_scanner`, `add`, `arrow_back`).
