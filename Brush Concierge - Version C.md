# Brush Concierge - Version C

This package contains Version C of the Brush Concierge homepage for A/B/C testing purposes. It has been designed to be modular and self-contained, allowing for easy integration into the main project alongside versions A and B.

## Table of Contents

1. [Package Contents](#package-contents)
2. [A/B/C Testing Implementation](#abc-testing-implementation)
3. [Integration Guide](#integration-guide)
4. [Testing and Verification](#testing-and-verification)
5. [Analytics Implementation](#analytics-implementation)
6. [Version C Features](#version-c-features)

## Package Contents

This package includes the following files and directories:

- `index.html` - The main homepage for Version C
- `style.css` - Stylesheet for Version C
- `app.js` - JavaScript functionality for Version C
- `checkout.html` - Checkout page for Version C
- `checkout.css` - Stylesheet for the checkout page
- `checkout.js` - JavaScript functionality for the checkout page
- `router.js` - A/B/C testing router script (copy for reference)
- `img/` - Directory containing all image assets for Version C

## A/B/C Testing Implementation

The A/B/C testing is implemented using a router script (`router.js`) that:

1. Randomly assigns users to version A, B, or C (33/33/33 split)
2. Stores this assignment in localStorage for persistence
3. Redirects users to the appropriate version based on their assignment
4. Includes hooks for tracking analytics

The router is designed to be placed at the root level of the project and used with an entry point HTML file (`index_router.html`) that serves as the initial landing page.

### Router Logic

The router uses the following logic:

```javascript
// Check if user already has a version assigned
const assignedVersion = localStorage.getItem('bc_homepage_version');

if (assignedVersion) {
    // User already has an assigned version
    redirectToAssignedVersion(assignedVersion);
} else {
    // New user, randomly assign a version
    const random = Math.random();
    const newVersion = random < 0.33 ? 'A' : (random < 0.66 ? 'B' : 'C');
    localStorage.setItem('bc_homepage_version', newVersion);
    redirectToAssignedVersion(newVersion);
}
```

## Integration Guide

To integrate Version C into the main project for A/B/C testing:

1. **Copy the Version C Package**:
   - Copy the entire `version_c` directory to the root of the main project

2. **Set Up the Router**:
   - Copy `router.js` to the root of the main project (if not already present)
   - Copy `index_router.html` to the root of the main project (if not already present)
   - Rename the original `index.html` to something else (e.g., `index_original.html`) if needed
   - Set `index_router.html` as the new entry point (rename it to `index.html` or update server configuration)

3. **Verify File Structure**:
   Your project structure should look like this:
   ```
   project_root/
   ├── index.html (original version A)
   ├── style.css (original version A)
   ├── app.js (original version A)
   ├── checkout.html (original version A)
   ├── img/ (original version A)
   ├── version_b/
   │   ├── index.html
   │   ├── style.css
   │   └── ...
   ├── version_c/
   │   ├── index.html
   │   ├── style.css
   │   ├── app.js
   │   ├── checkout.html
   │   ├── checkout.css
   │   ├── checkout.js
   │   └── img/
   ├── router.js
   └── index_router.html (or renamed to index.html)
   ```

4. **Update Paths if Necessary**:
   - If your project uses absolute paths or has a different structure, update the paths in the router.js file accordingly

## Testing and Verification

To test and verify the A/B/C testing implementation:

### Manual Version Assignment

You can manually set the version using the browser console:

```javascript
// Set to Version A
localStorage.setItem('bc_homepage_version', 'A');

// Set to Version B
localStorage.setItem('bc_homepage_version', 'B');

// Set to Version C
localStorage.setItem('bc_homepage_version', 'C');

// Reset for random assignment
localStorage.removeItem('bc_homepage_version');
```

Alternatively, use the exposed router API:

```javascript
// Set to Version A
bcRouter.setVersion('A');

// Set to Version B
bcRouter.setVersion('B');

// Set to Version C
bcRouter.setVersion('C');

// Reset for random assignment
bcRouter.resetVersion();

// Get current version
bcRouter.getCurrentVersion();
```

### Testing Process

1. Open the entry point HTML file in your browser
2. Open the browser console (F12 or right-click > Inspect > Console)
3. Verify that a version is assigned and logged in the console
4. Test each version by manually setting the version and refreshing the page
5. Verify that the correct version is displayed each time
6. Reset the version and refresh multiple times to verify random assignment

## Analytics Implementation

The router includes hooks for tracking analytics. To implement your analytics:

1. **Page View Tracking**:
   The `trackPageView(version)` function is called when a user is assigned to a version.

2. **Conversion Tracking**:
   The `trackConversion(version, action)` function can be called to track conversion events.

### Google Analytics Example

```javascript
// In your analytics script
function setupAnalytics() {
    // Track button clicks for conversion
    document.querySelectorAll('.btn--primary').forEach(button => {
        button.addEventListener('click', function() {
            bcRouter.trackConversion('button_click');
        });
    });
    
    // Track form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            bcRouter.trackConversion('form_submit');
        });
    });
}

// Call this after the page is loaded
document.addEventListener('DOMContentLoaded', setupAnalytics);
```

## Version C Features

Version C of the Brush Concierge homepage includes the following improvements:

1. **Updated Color Scheme**:
   - Primary brand color: Deep burgundy (#8B0000)
   - Accent color: Gold (#D4AF37)
   - Trust elements: Navy (#001F3F)
   - CTA buttons: Coral (#FF7F50)

2. **Improved Typography**:
   - Headlines: Playfair Display
   - Body text: Montserrat
   - Consistent font sizing hierarchy
   - Improved line spacing for readability

3. **Enhanced Pricing Structure**:
   - 3-tier pricing model (Essentials, Curator, Atelier)
   - "Most Popular" badge on the Curator tier
   - Annual payment option with 2 months free
   - Pricing comparison chart

4. **Trust and Security Enhancements**:
   - Security badges in footer
   - "100% Satisfaction Guarantee" badge
   - "Fully Insured • Damage Protection Included" text
   - FDA-Registered Facility badge

5. **Content Improvements**:
   - Updated value proposition focusing on investment protection
   - "Membership" terminology instead of "subscription"
   - Enhanced testimonials with full names and professional titles
   - Expanded FAQ section with new questions

6. **Visual Enhancements**:
   - Visual 4-step process with icons
   - About Us section with founder story
   - Team credentials and facility information
   - Mission statement about beauty tool care

---

For any questions or issues with the integration, please contact the development team.

