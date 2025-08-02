# Brush Concierge Homepage A/B/C Testing

## Integration Instructions

### Required Components
- **Version A**: Original `index.html` (already in project root)
- **Version B**: Complete `version_b` folder
- **Version C**: Complete `version_c` folder
- **Router**: `index_router_abc.html` entry point

### Step 1: Copy Variant Folders
- Copy `version_b` folder to project root
- Copy `version_c` folder to project root
- Keep original `index.html` as Version A

### Step 2: Create Router Entry Point
Create `index_router_abc.html` in project root:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brush Concierge - Loading</title>
    <style>
        body {font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; margin:0; background-color:#f8f9fa;}
        .loader {border:5px solid #f3f3f3; border-top:5px solid #3498db; border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite;}
        @keyframes spin {0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);}}
    </style>
</head>
<body>
    <div class="loader"></div>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const assignedVersion = localStorage.getItem('bc_homepage_version');
            
            if (assignedVersion) {
                redirectToAssignedVersion(assignedVersion);
            } else {
                const random = Math.random();
                const newVersion = random < 0.33 ? 'A' : (random < 0.66 ? 'B' : 'C');
                localStorage.setItem('bc_homepage_version', newVersion);
                redirectToAssignedVersion(newVersion);
            }
            trackPageView();
        });

        function redirectToAssignedVersion(version) {
            if (version === 'A') window.location.href = 'index.html';
            else if (version === 'B') window.location.href = 'version_b/index.html';
            else window.location.href = 'version_c/index.html';
        }

        function trackPageView() {
            const version = localStorage.getItem('bc_homepage_version') || 'unknown';
            console.log('Viewing homepage version: ' + version);
            // Add analytics tracking code here
        }
    </script>
</body>
</html>
```

### Step 3: Configure Entry Point
Choose one method:
- **Option 1**: Rename to `index.html` (backup original first)
- **Option 2**: Configure server to use as default document
- **Option 3**: Update links to point to `index_router_abc.html`

### Step 4: Testing
Verify correct operation:
- Router assigns users to versions A, B, or C
- Assignment persists in localStorage
- Users return to same version on repeat visits

**Manual Testing Commands:**
```javascript
// Test Version A
localStorage.setItem('bc_homepage_version', 'A'); 
window.location.reload();

// Test Version B
localStorage.setItem('bc_homepage_version', 'B'); 
window.location.reload();

// Test Version C
localStorage.setItem('bc_homepage_version', 'C'); 
window.location.reload();

// Reset for random assignment
localStorage.removeItem('bc_homepage_version'); 
window.location.reload();
```

### Step 5: Analytics Integration
Add tracking code to `trackPageView()` function:

```javascript
function trackPageView() {
    const version = localStorage.getItem('bc_homepage_version') || 'unknown';
    
    // Example: Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
            'homepage_version': version
        });
    }
}
```

## Maintenance Guidelines

### Updates
- Maintain content parity across versions
- Ensure consistent functionality
- Update analytics across all versions
- Document intentional differences

### Test Completion
1. Analyze metrics to determine winning version
2. Implement winning version as primary homepage
3. Remove router and alternate versions
4. Update links to point to final version

## Resources
- Version B README: `/version_b/README.md`
- Version C README: `/version_c/README.md`
- Project documentation: `handoff.md`
