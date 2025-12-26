# Screen Specification: Invoices Screen

## Overview
A financial overview for customers to view and manage service payments.

## Visual Design
*   **Theme**: Light/Dark mode supported.
*   **Layout**: Top Nav + Header + Stats Grid + Table Card.

## UI Components

### Header
*   **Title**: "Invoices".
*   **Subtitle**: "View and manage your service payments...".
*   **Action**: "Export All" button (`download`).

### Stats Overview (3 Cards)
1.  **Total Spent (YTD)**:
    *   Icon: `payments` (Blue).
    *   Value: Currency (e.g., $2,845.00).
2.  **Upcoming Payments**:
    *   Icon: `pending_actions` (Amber).
    *   Value: Currency (e.g., $120.00).
3.  **Last Payment**:
    *   Icon: `event_available` (Green).
    *   Value: Date (e.g., Oct 24, 2023).

### Invoices Table
*   **Filters**:
    *   Search Bar (Invoice #, Service...).
    *   Dropdowns: Filter by Status, Vehicle, Sort (Newest First).
*   **Columns**:
    *   **Invoice**: ID (e.g., #INV-4821, Bold Primary Color).
    *   **Date**: Text (Oct 24, 2023).
    *   **Vehicle**: Thumbnail + Name + License Plate.
    *   **Service**: Description (e.g., Synthetic Oil Change).
    *   **Amount**: Currency (Bold).
    *   **Status**: Badge (Paid [Green], Pending [Amber]).
    *   **Actions**:
        *   Download PDF (`picture_as_pdf`).
        *   View Details (`visibility`).
        *   *If Pending*: "Pay Now" Button (Primary).

### Support Banner
*   **Visual**: Dark gradient background (`from-slate-900 to-slate-800`).
*   **Content**: Icon (`support_agent`), Title ("Have questions...?"), Subtext (Hours).
*   **Action**: "Contact Support" button (White).

## Interactions
*   **Export All**: Triggers bulk download.
*   **Download PDF**: Downloads specific invoice.
*   **View Details**: Opens Invoice Detail view.
*   **Pay Now**: Initiates payment gateway flow.

## Assets
*   **Icons**: Material Symbols (`payments`, `pending_actions`, `event_available`, `search`, `filter_list`, `directions_car`, `sort`, `picture_as_pdf`, `visibility`, `support_agent`).
