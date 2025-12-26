# Screen Specification: Login Screen

## Overview
The entry point for the application, allowing users to authenticate and select their role.

## Visual Design
*   **Theme**: Light/Dark mode supported.
*   **Font**: Inter, sans-serif.
*   **Primary Color**: `#137fec` (Blue).
*   **Background**: Light (`#f6f7f8`) / Dark (`#101922`).
*   **Layout**: Centered Card on a full-screen background.

## UI Components

### Header
*   **Logo**: `garage_home` icon (Material Symbols).
*   **Title**: "Garage OS" (Text).
*   **Nav Links**: "Support", "Contact".

### Login Card
*   **Title**: "Welcome Back".
*   **Subtitle**: "Sign in to manage your vehicle or garage."
*   **Role Switcher**:
    *   Segmented Control / Radio Group.
    *   Options: "Mechanic", "Customer".
    *   Default: Mechanic (implied by `checked` attribute in mock).
*   **Form**:
    *   **Email Address**: Input field with `mail` icon prefix. Placeholder: `user@example.com`.
    *   **Password**: Input field with `lock` icon prefix and `visibility` toggle (eye icon) suffix.
    *   **Forgot Password**: Link.
    *   **Submit Button**: "Sign In" with `arrow_forward` icon suffix. Full width.
*   **Footer**: "Don't have an account? Sign up" link.

### Page Footer
*   Links: "Privacy Policy", "Terms of Service".

## Interactions
*   **Role Selection**: Toggles between Mechanic and Customer contexts (likely affects login logic or redirect).
*   **Password Visibility**: Toggles masking of password characters.
*   **Form Submission**: Validates inputs and sends POST request to `/auth/login`.

## Assets
*   **Icons**: Google Material Symbols Outlined.
*   **CSS Framework**: Tailwind CSS.
