## Current Work Focus
- Implemented a new checkout system, including new HTML, CSS, and JavaScript files.
- Updated existing core files (`index.html`, `app.js`, `README.md`) to integrate with the new checkout flow.
- Managed Git operations for the new feature branch, including resolving an embedded repository warning.
- Fixed a CSS syntax error in the new checkout styling.
- Started a local development server for testing the new checkout flow.

## Recent Changes
- **2025-07-14**: Created new Git branch: `feature/checkout-system`.
- **2025-07-14**: Updated `index.html` with new CTAs linking to checkout.
- **2025-07-14**: Updated `app.js` (removed waitlist function).
- **2025-07-14**: Updated `README.md` with new project details.
- **2025-07-14**: Created `checkout.html` for the checkout page structure.
- **2025-07-14**: Created `checkout.css` for the checkout page styling.
- **2025-07-14**: Created `checkout.js` for the checkout page functionality (includes Stripe placeholder).
- **2025-07-14**: Resolved Git warning about embedded repository.
- **2025-07-14**: Fixed CSS syntax error in `checkout.css`.
- **2025-07-14**: Pushed `feature/checkout-system` branch to remote.
- **2025-07-14**: Started local development server (`npx serve .`) for testing.
- **2025-07-11**: Ran website locally using `npx serve .`.
- **2025-07-11**: Committed and pushed changes to `main` branch.
- **2025-07-11**: Deployed to Vercel production.
- **2025-07-11**: Verified production site on Vercel preview and custom domain.
- **2025-07-11**: Addressed user feedback on perceived production site discrepancy.

## Next Steps
- Replace Stripe placeholder key in `checkout.js`.
- Test the new checkout flow locally.
- Deploy changes to production.

## Active Decisions and Considerations
- Git branching used for new feature development.
- Stripe integration is a placeholder, requires actual key.
- Local server port may vary if 3000 is in use.

## Learnings and Project Insights
- Git submodule warnings can occur with nested repositories; resolved by removing from index.
- CSS syntax errors can prevent proper styling; careful review is necessary.
- `npx serve .` is effective for local testing of static sites.
- Browser caching and DNS propagation can cause delays in live site updates.
- Comprehensive `README.md` documentation is crucial for AI assistance.
