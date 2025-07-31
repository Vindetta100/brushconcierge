/**
 * A/B Testing Router for Brush Concierge Homepage
 * 
 * This script handles redirecting users to either version A or version B
 * of the homepage based on random assignment or existing assignment in localStorage.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user already has a version assigned
    const assignedVersion = localStorage.getItem('bc_homepage_version');
    
    if (assignedVersion) {
        // User already has an assigned version, redirect if needed
        redirectToAssignedVersion(assignedVersion);
    } else {
        // New user, randomly assign a version
        const newVersion = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem('bc_homepage_version', newVersion);
        redirectToAssignedVersion(newVersion);
    }
    
    // Track page view for analytics (implement your tracking here)
    trackPageView();
});

/**
 * Redirects to the appropriate version based on assignment
 */
function redirectToAssignedVersion(version) {
    const currentPath = window.location.pathname;
    
    // Only redirect if we're on the router page
    if (currentPath.endsWith('index_router.html')) {
        if (version === 'A') {
            window.location.href = 'index.html';
        } else {
            window.location.href = 'version_b/index.html';
        }
    }
}

/**
 * Tracks page view with version information
 */
function trackPageView() {
    const version = localStorage.getItem('bc_homepage_version') || 'unknown';
    
    // Example tracking - replace with your actual analytics implementation
    console.log('Viewing homepage version: ' + version);
    
    // Implement your tracking code here
    // Example: if (typeof gtag === 'function') { gtag('event', 'page_view', {'homepage_version': version}); }
}
