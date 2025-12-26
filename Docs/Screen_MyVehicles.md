# Screen Specification: My Vehicles Screen

## Overview
The central hub for customers to manage their fleet, view status summaries, and initiate actions.

## Visual Design
*   **Theme**: Light/Dark mode supported.
*   **Layout**: Top Nav + Main Content Area with Header, Filters, and Grid.

## UI Components

### Header
*   **Title**: "My Vehicles".
*   **Subtitle**: "Manage your garage...".
*   **Action**: "Add Vehicle" button (Primary).

### Filters & Search
*   **Search**: Input field ("Search by make, model, or license plate...").
*   **Tabs/Pills**:
    *   "All Statuses" (Filter).
    *   "Active (3)" (Primary/Selected).
    *   "Archived" (Ghost).

### Vehicle Grid (Cards)
*   **Card Layout**: Image Header + Content Body.
*   **Image Header**:
    *   Large Vehicle Photo.
    *   **Status Badge`**:
        *   *In Repair*: Blue Pulse.
        *   *Service Due*: Amber Warning.
        *   *No Issues*: Green Check.
    *   **Action Menu**: "more_horiz" icon (Top right, visible on hover).
*   **Content Body**:
    *   **Title**: Year Make Model (e.g., "2018 Ford Mustang").
    *   **Subtitle**: Trim/Spec (e.g., "GT Premium Fastback").
    *   **License**: Badge style ("License: ABC-1234").
    *   **Status Footer**:
        *   *In Repair*: Progress Bar (Diagnostics Phase, 45%) + "Track Repair" (Primary) / "View Details" (Secondary).
        *   *Service Due*: "Oil Change Overdue" (Amber text) + "Schedule" (Primary) / "View Details" (Secondary).
        *   *No Issues*: "Next Service: Jan 2024" + "Book Service" (Secondary) / "View Details" (Secondary).
*   **Empty State / Add Card**:
    *   Dashed border card.
    *   "Add Another Vehicle" CTA.

## Interactions
*   **Track Repair**: Navigates to Active Job Dashboard.
*   **Schedule**: Opens Booking/Appointment flow.
*   **View Details**: Opens Vehicle History/Details.
*   **Search/Filter**: Updates grid content.

## Assets
*   **Icons**: Material Symbols (`garage_home`, `add`, `search`, `filter_list`, `more_horiz`, `directions_car`, `warning`, `check_circle`, `calendar_clock`, `event_upcoming`).
