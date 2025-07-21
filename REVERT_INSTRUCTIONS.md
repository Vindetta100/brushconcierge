# 🚨 EMERGENCY REVERT INSTRUCTIONS 🚨

## Current Commit Info
- **Feature Commit**: `acd3c24` - "feat: add legal page and update checkout functionality"
- **Previous Safe Commit**: `e6f2265` - "error message fix" (on main)
- **Files Changed**: `legal.html` (new), `checkout.html` (modified)

## If Bug Found After Merge to Main

### Option 1: Revert Specific Commit (Recommended)
```bash
git revert acd3c24
```
- ✅ Safe for shared repositories
- ✅ Preserves history
- ✅ Creates new commit that undoes changes

### Option 2: Reset to Previous Safe State (Nuclear Option)
```bash
git reset --hard e6f2265
git push --force-with-lease origin main
```
- ⚠️ **DANGER**: Only use if no one else has pulled latest main
- ⚠️ Rewrites history

### Option 3: Quick Hotfix
```bash
# Remove the problematic files temporarily
git rm legal.html
git checkout e6f2265 -- checkout.html
git commit -m "hotfix: temporarily remove legal page due to bug"
```

## Pre-Merge Safety Check
Before merging to main, test these URLs:
- http://localhost:3000/checkout.html
- http://localhost:3000/legal.html
- Verify all links work between pages

## Recovery Commands (Copy & Paste Ready)
```bash
# Quick revert (most common)
git revert acd3c24

# Emergency reset (if things go really wrong)
git reset --hard e6f2265
```

**Created**: $(date)
**Purpose**: Emergency revert reference for legal page + checkout updates
