# Screen Specification: Mechanic Dashboard

## Overview
The main hub for mechanics and shop managers to view active jobs, shop performance metrics, and manage the workflow.

## Visual Design
*   **Theme**: Light/Dark mode supported.
*   **Layout**: Top Navigation Bar + Main Content Area (Sidebar optional/hidden in mock, top nav used).

## UI Components

### Top Navigation
*   **Brand**: "AutoFix Manager" with Logo.
*   **Links**: Dashboard, Jobs, Inventory, Customers, Settings.
*   **Actions**: Notification Bell, User Profile (Avatar + Name), Mobile Menu Toggle.

### Page Header
*   **Title**: "Garage Dashboard".
*   **Subtitle**: "Overview of active repairs and shop performance".
*   **Primary Action**: "New Job" button (Icon `add`).

### Metrics Cards (Grid of 3)
1.  **Active Jobs**:
    *   Value: "12".
    *   Trend: "+2 from yesterday" (Green/Up Arrow).
    *   Icon: `build_circle`.
2.  **Revenue Today**:
    *   Value: "$1,450".
    *   Visual: Progress bar (~65% filled).
    *   Icon: `payments` (Green).
3.  **Pending Parts**:
    *   Value: "3".
    *   Warning: "Requires attention" (Amber).
    *   Icon: `inventory` (Amber).

### Job List Controls
*   **Search**: Input field ("Search by plate, name, or Job ID...").
*   **Filters**:
    *   "Status: All" (Dropdown).
    *   "Mechanic: All" (Dropdown).
*   **Sort**: "Sort by: Date" (Dropdown).

### Job Table
*   **Columns**:
    *   **Job ID**: e.g., `#JOB-1024`.
    *   **Vehicle**: Make/Model (Bold) + Service Type (Subtext). e.g., "2018 Ford F-150" / "Oil Change...".
    *   **Customer**: Avatar + Name.
    *   **Assigned To**: Name or "Unassigned".
    *   **Status**: Color-coded badges.
        *   *In Progress*: Blue.
        *   *Scheduled*: Gray/Slate.
        *   *Waiting for Parts*: Amber.
        *   *Ready for Pickup*: Green.
        *   *Urgent*: Red.
    *   **Action**: `chevron_right` icon to view details.
*   **Pagination**: "Showing X to Y of Z results" with Previous/Next buttons.

## Interactions
*   **Clicking a row**: Navigates to Job Details screen.
*   **New Job Button**: Opens Job Creation modal or screen.
*   **Filters**: Update table data in real-time or on selection.

## Assets
*   **Icons**: Material Symbols Outlined (`search`, `filter_list`, `sort`, `chevron_right`, `notifications`, etc.).
