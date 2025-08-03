/**
 * Brush Concierge A/B/C Testing Router
 * 
 * This script handles the routing logic for the A/B/C testing of the Brush Concierge homepage.
 * It randomly assigns users to version A, B, or C (33/33/33 split) and stores this assignment
 * in localStorage for persistence. It also includes hooks for tracking analytics.
 */

// Analytics tracking function
function trackPageView(version) {
    // This is a placeholder for your analytics implementation
    console.log(`[Analytics] Page view tracked for version ${version}`);
    
    // Example implementation with Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
            'event_category': 'ab_testing',
            'event_label': `version_${version.toLowerCase()}`,
            'value': 1
        });
    }
}

// Function to track conversion events
function trackConversion(version, action) {
    // This is a placeholder for your conversion tracking implementation
    console.log(`[Analytics] Conversion tracked for version ${version}, action: ${action}`);
    
    // Example implementation with Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
            'event_category': 'ab_testing',
            'event_label': `version_${version.toLowerCase()}_${action}`,
            'value': 1
        });
    }
}

// Function to redirect to the assigned version
function redirectToAssignedVersion(version) {
    console.log(`[Router] Redirecting to version ${version}`);
    
    // Track the page view for analytics
    trackPageView(version);
    
    // Redirect to the appropriate version using professional URLs
    if (version === 'A') {
        window.location.href = '/classic/';
    } else if (version === 'B') {
        window.location.href = '/premium/';
    } else {
        window.location.href = '/concierge/';
    }
}

// Main function to handle version assignment and routing
function initializeRouter() {
    console.log('[Router] Initializing A/B/C testing router');
    
    // Skip initialization on version setter pages to prevent race condition
    if (window.location.pathname.includes('set_version_')) {
        console.log('[Router] Skipping initialization on version setter page');
        return;
    }
    
    // Check if user already has a version assigned
    const assignedVersion = localStorage.getItem('bc_homepage_version');
    
    if (assignedVersion) {
        // User already has an assigned version
        console.log(`[Router] User has assigned version: ${assignedVersion}`);
        redirectToAssignedVersion(assignedVersion);
    } else {
        // New user, assign to Concierge version (Version C)
        const newVersion = 'C';
        
        console.log(`[Router] Assigning new version to user: ${newVersion}`);
        localStorage.setItem('bc_homepage_version', newVersion);
        redirectToAssignedVersion(newVersion);
    }
}

// Initialize the router when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeRouter);

// This comment is added to force a Vercel redeployment.

// Export functions for external use (e.g., for testing or manual triggering)
window.bcRouter = {
    setVersion: function(version) {
        if (['A', 'B', 'C'].includes(version)) {
            localStorage.setItem('bc_homepage_version', version);
            console.log(`[Router] Version manually set to: ${version}`);
            return true;
        } else {
            console.error(`[Router] Invalid version: ${version}. Must be 'A', 'B', or 'C'.`);
            return false;
        }
    },
    resetVersion: function() {
        localStorage.removeItem('bc_homepage_version');
        console.log('[Router] Version assignment reset. Next page load will assign a random version.');
        return true;
    },
    getCurrentVersion: function() {
        return localStorage.getItem('bc_homepage_version') || null;
    },
    trackConversion: function(action) {
        const version = this.getCurrentVersion();
        if (version) {
            trackConversion(version, action);
            return true;
        } else {
            console.error('[Router] No version assigned. Cannot track conversion.');
            return false;
        }
    }
};
