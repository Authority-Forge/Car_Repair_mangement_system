# Screen Specification: Customer View

## Overview
The tailored dashboard for customers to track their ongoing repairs, manage their personal garage, and view service history.

## Visual Design
*   **Theme**: Light/Dark mode supported.
*   **Layout**: Top Nav + Dashboard Grid (Main content left, Sidebar right).

## UI Components

### Header
*   **Brand**: "AutoFix Garage" + Icon.
*   **Nav Links**: Dashboard, My Vehicles, Invoices, Support.
*   **User Profile**: Name ("Alex Morgan"), Status ("Premium Member"), Avatar.

### Welcome Section
*   **Greeting**: "Welcome back, {Name}".
*   **Status Text**: "You have X vehicle(s) currently in service."

### Active Repair Section
*   **Card Header**: "Active Repair".
*   **Status Banner**: "In Progress" badge + "Est. Completion: {Time}".
*   **Content**:
    *   **Vehicle Image**: Large thumbnail.
    *   **Details**: Repair ID, Make/Model, License Plate.
    *   **Actions**: "Message Mechanic" (Primary), "View Quote" (Secondary).
*   **Progress Tracker**:
    *   **Current Stage**: Display name (e.g., "Engine Diagnostics") + Percentage (e.g., "50%").
    *   **Visual**: Progress bar with pulse effect.
    *   **Stages**: Check-in -> Diagnostics -> Repair -> Quality Check -> Ready.

### My Garage Section
*   **Header**: "My Garage" + "Add Vehicle" button.
*   **Vehicle Cards (Grid)**:
    *   Thumbnail Image.
    *   Name (Year/Make/Model).
    *   License Plate.
    *   **Status Indicator**:
        *   "No Issues" (Green Check).
        *   "Service Due" (Amber Clock).
    *   **Action**: Schedule Service button (`calendar_add_on`).

### Service History (Sidebar/Widget)
*   **Header**: "Service History" + "View All" link.
*   **List Items**:
    *   Date + Status (e.g., "Paid" badge).
    *   Description (e.g., "Oil Change...").
    *   Vehicle Name.
    *   Amount ($).
    *   **Action**: "Invoice" download button (on hover).
*   **Footer**: "View Full History" button.

## Interactions
*   **Message Mechanic**: Opens chat interface.
*   **View Quote**: Opens financial breakdown/approval screen.
*   **Schedule Service**: Initiates booking flow for specific vehicle.
*   **Download Invoice**: Triggers PDF download.

## Assets
*   **Icons**: Material Symbols (`timelapse`, `autorenew`, `chat`, `search_check`, `garage_home`, `add`, `check_circle`, `schedule`, `history`, `download`).
