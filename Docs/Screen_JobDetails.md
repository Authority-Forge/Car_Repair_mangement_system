# Screen Specification: Job Details Screen

## Overview
The core workspace for mechanics and advisors to manage a specific repair job, track work records, and communicate.

## Visual Design
*   **Theme**: Light/Dark mode supported.
*   **Layout**: Top Nav + 3-Column Grid for large screens (Responsive).

## UI Components

### Page Header
*   **Breadcrumbs**: Jobs > Job #{ID}.
*   **Title**: Vehicle Name (e.g., "2018 Ford F-150 Raptor").
*   **Metadata**: Job ID, Created Date, Advisor Name.
*   **Global Actions**:
    *   **Status Dropdown**: Options (In Progress, Waiting on Parts, Completed, Invoiced).
    *   **Print Button**: Icon `print`.
    *   **Save Changes**: Primary button, Icon `save`.

### Left Column (Context Info)
1.  **Vehicle Details Card**:
    *   Image with Gradient Overlay & Stock Number.
    *   Fields: VIN, Mileage, License Plate, Engine Type.
    *   Action: Edit button (`edit`).
2.  **Customer Card**:
    *   Profile: Avatar, Name, "Customer since...".
    *   Contact Info: Phone, Email, Address.
    *   Actions: Call (`call`), SMS (`sms`) buttons.
3.  **Service History Card**:
    *   Timeline list of previous jobs (Job #, Date, Type).
    *   Link: "View All History".

### Middle Column (Work Records)
*   **Header**: "Work Records" + Settings button.
*   **Table**:
    *   **Description**: Name + Subtext (e.g., "Oil Change Synthetic" + "Standard service package").
    *   **Type**: Badge (Labor - Blue, Part - Green).
    *   **Qty/Hrs**: Numeric.
    *   **Rate**: Currency.
    *   **Total**: Currency (Calculated).
*   **Action**: "Add Part or Labor" button (Dashed border, full width).
*   **Summary Footer**: Subtotal, Tax (%), Total (Large Bold).

### Right Column (Communication)
*   **Tabs**: "Internal Note" vs "Customer Chat".
*   **Feed**:
    *   Chronological list of events/messages.
    *   **Internal Notes**: Yellow background/border.
    *   **Customer/Public Messages**: Gray/Blue background.
    *   **Metadata**: User Name, Role, Timestamp.
*   **Input Area**:
    *   Textarea.
    *   Actions: Attach File (`attach_file`), Send (`send`).
    *   Toggle: "Notify Customer" (Checkbox/Toggle).

## Interactions
*   **Status Change**: Updates job status immediately or upon save.
*   **Add Item**: Opens modal/form to add line item to Work Records.
*   **Tab Switch**: Toggles between Internal and Public chat feeds.
*   **Send Message**: Posts message to the selected feed.

## Assets
*   **Icons**: Material Symbols (`garage`, `print`, `save`, `edit`, `person_search`, `call`, `sms`, `settings`, `add_circle`, `sticky_note_2`, `attach_file`, `send`).
