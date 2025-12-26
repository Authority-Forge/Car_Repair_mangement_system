# Screen Specification: Support Screen

## Overview
A dedicated help center for customers to find answers or contact the shop.

## Visual Design
*   **Theme**: Light/Dark mode supported.
*   **Layout**: Top Nav + Two-Column Layout (Main Content + Sidebar).

## UI Components

### Header
*   **Title**: "Support Center".
*   **Subtitle**: "Find answers...".

### Main Content (Left Column)
1.  **FAQ Section**:
    *   **Header**: "Frequently Asked Questions" (`quiz` icon).
    *   **Accordion Items**:
        *   "How do I book a service appointment?"
        *   "What are your operating hours?" (Expanded by default in mock).
        *   "Do you offer loaner vehicles?"
        *   "How can I view and pay my invoices?"
    *   **Interaction**: Click to expand/collapse.
2.  **Contact Form**:
    *   **Header**: "Send us a message" (`mail` icon).
    *   **Fields**:
        *   Your Name (Pre-filled if logged in).
        *   Email Address (Pre-filled).
        *   Subject (Dropdown: General Inquiry, Service Scheduling, Billing Question, Feedback).
        *   Message (Textarea).
    *   **Action**: "Send Message" button (`send`).

### Sidebar (Right Column)
1.  **Help Banner**: "We're here to help" + Support Icon.
2.  **Contact Info List**:
    *   **Phone**: Icon `call`, Number, Hours.
    *   **Email**: Icon `mail`, Address, Response time.
    *   **Location**: Icon `location_on`, Address.
3.  **Live Actions**:
    *   **Live Chat** Button.
    *   **Call Now** Button.
4.  **Operating Hours Card**:
    *   Mon-Fri: 8:00 AM - 6:00 PM.
    *   Sat: 9:00 AM - 2:00 PM.
    *   Sun: Closed (Red Badge).

## Interactions
*   **FAQ Toggle**: Expands details.
*   **Form Submit**: Sends support ticket.
*   **Live Chat**: Opens chat widget (Intercom/Drift style?).
*   **Call Now**: Triggers `tel:` link.

## Assets
*   **Icons**: Material Symbols (`quiz`, `expand_more`, `mail`, `send`, `support_agent`, `call`, `location_on`, `schedule`).
