# Icon Fixes Implementation Plan

**Project:** Brush Bliss Concierge  
**Branch:** icon-fixes  
**Objective:** Standardize concierge card icons to match welcome folder's emoji approach

## Phase 1: Git Setup
- [ ] Create new branch `icon-fixes` from current branch
- [ ] Switch to new branch for development

## Phase 2: File Analysis (Completed)
- [x] **Root checkout.js**: Already uses emoji icons (💳) - correct implementation  
- [x] **Concierge checkout.js**: Uses complex CSS/highlighting system - needs update
- [x] **Welcome checkout.js**: Clean emoji approach - reference implementation

## Phase 3: Code Modifications

### File: concierge/checkout.js
- [ ] **Lines 476-502**: Replace complex `updateCardTypeIcon` method
- [ ] **Remove**: CSS class manipulation and highlighting logic  
- [ ] **Add**: Simple emoji assignment like welcome folder
- [ ] **Add**: `getCardType()` helper method for pattern matching

## Phase 4: Documentation
- [ ] **Update**: CHANGELOG.md with icon fixes entry
- [ ] **Document**: Changes made and rationale

## Phase 5: Testing & Validation  
- [ ] Test card number input formatting functionality
- [ ] Verify emoji icons display correctly across browsers
- [ ] Ensure no broken CSS dependencies
- [ ] Validate payment flow works properly

## Phase 6: Git Commits
- [ ] **Commit 1**: "Replace CSS-based card icons with emoji icons in concierge checkout"
- [ ] **Commit 2**: "Remove unused payment icon highlighting logic"
- [ ] **Commit 3**: "Update CHANGELOG.md - document concierge icon fixes"  
- [ ] **Final**: Push branch and verify all changes

## Files Modified
- `concierge/checkout.js` - Primary target for icon system update
- `CHANGELOG.md` - Document changes made

## Success Criteria
- Concierge icons match welcome folder simplicity
- All card types show 💳 emoji consistently
- No CSS dependencies for card type display  
- Maintain all existing payment functionality

## Code Changes Preview
**Replace:** Complex CSS class system with payment highlighting  
**With:** Simple emoji approach: `iconElement.textContent = icons[cardType]`
