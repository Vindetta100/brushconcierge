# Brush Concierge Homepage - Version B

## AI/Developer Handoff Instructions

### Project Intent
This package implements A/B testing for the Brush Concierge homepage. The goal is to maintain two separate versions of the homepage (A and B) and randomly assign users to either version to measure conversion performance. All necessary files for implementing Version B are included in this folder, along with the router mechanism for handling version assignment.

### Integration Steps (EXACTLY FOLLOW THESE STEPS)
1. **Copy Both Required Components:**
   - Copy this entire `version_b` folder to the root directory of the original Brush Concierge project
   - Copy `index_router.html` file to the root directory of the original Brush Concierge project

2. **Modify Entry Point:**
   - IMPORTANT: The original `index.html` in the root directory becomes Version A
   - `version_b/index.html` becomes Version B
   - Make `index_router.html` the main entry point by either:
     a. Renaming it to index.html (backup original first)
     b. Setting it as the default page in server configuration
     c. Updating any existing links to point to index_router.html

3. **Verify Routing Structure:**
   - Ensure path to Version A is `/index.html`
   - Ensure path to Version B is `/version_b/index.html`
   - Both paths must be accessible from the router

4. **Test Implementation:**
   - Load `index_router.html` in browser
   - Check console for version assignment
   - Verify both versions load correctly
   - Test localStorage manipulation:
     - Set Version A: `localStorage.setItem('bc_homepage_version', 'A')`
     - Set Version B: `localStorage.setItem('bc_homepage_version', 'B')`
     - Reset: `localStorage.removeItem('bc_homepage_version')`

### A/B Test Mechanics
- Users randomly receive either Version A or B (50/50 split)
- Assignment stored in localStorage for consistent experience
- Version info logged to console for debugging
- Ready for analytics integration in `router.js`

### Analytics Implementation
1. Implement tracking in the `trackPageView()` function in `router.js`
2. Track metrics across both versions:
   - Conversion rate
   - Time on page
   - Click-through rate
   - Bounce rate

### Maintaining Both Versions
- Make identical content/functionality updates to both:
  - Version A: `/index.html`
  - Version B: `/version_b/index.html`
- Keep CSS and JS dependencies synchronized
- Document any intentional differences between versions

### File Structure
- `index.html` - Version B homepage
- CSS files:
  - `style.css` - Main stylesheet
  - `sticky-header.css` - Header styling
  - `spacing-fixes.css` - Layout adjustments
  - `premium-design.css` - Premium design elements
- `app.js` - Main application JavaScript
- `router.js` - A/B testing logic
- `img/` - Image assets directory

### After Testing Completion
1. Analyze performance metrics
2. Select winning version
3. Implement winning version as the primary homepage
4. Remove router and alternate version

For questions or clarification on implementation, refer to `handoff.md` in the main project directory.
