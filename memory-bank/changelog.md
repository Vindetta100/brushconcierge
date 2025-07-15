# Changelog: Brush Concierge

## [1.1.2] - 2025-07-14
### Added
- **Checkout System**: Implemented new checkout flow with `checkout.html`, `checkout.css`, `checkout.js`.
- **Git Branch**: Created `feature/checkout-system` for development.

### Changed
- **index.html**: Updated CTAs to link to new checkout page.
- **app.js**: Removed waitlist-specific functions.
- **README.md**: Updated with new project details and instructions.

### Fixed
- **Git Warning**: Resolved embedded repository warning.
- **CSS Syntax**: Corrected error in `checkout.css`.

## [1.1.1] - 2025-07-11
### Added
- **Local Run**: Successfully started local development server.
- **Git Operations**: Committed and pushed changes to `main` branch.
- **Production Deployment**: Deployed to Vercel production.
- **Website Verification**: Confirmed latest content on Vercel preview and custom domain.

## [1.1.0] - 2025-07-08
### Fixed
- **Vercel Deployment**: Resolved issues with custom domain updates and design discrepancies.
- **Local Development**: Corrected `package.json` `dev` script to `npx serve .`.

### Changed
- **README.md**: Updated with `npm install -g serve` prerequisite.
- **README.md**: Updated local development command.
- **README.md**: Added note on browser caching/DNS for deployment.
- **README.md**: Consolidated Vercel deployment steps into "Quick Start" section.

## [1.0.9] - 2025-07-06
### Changed
- **Live Site Logo Styling**: Identified discrepancy on live site.

## [1.0.8] - 2025-07-06
### Changed
- **Vercel Deployment Workflow**: Confirmed direct local `vercel --prod` deployment updates live site.

## [1.0.7] - 2025-07-06
### Changed
- **Local Development Instructions**: Updated `README.md` to use `npx serve .`.

## [1.0.6] - 2025-07-06
### Added
- **Company Logo**: Text-based logo "Brush Concierge" added to `index.html` and styled in `style.css`.

## [1.0.5] - 2025-07-06
### Fixed
- **Vercel Deployment**: Re-triggered production build for `brushconcierge.com`.
- **Waitlist Functionality**: Confirmed working on production site.

## [1.0.4] - 2025-07-06
### Changed
- **Repository Visibility**: Changed to public.

## [1.0.3] - 2025-07-06
### Added
- **Security Scan**: Performed on codebase.
- **Review Report**: `review-report.md` generated.

## [1.0.2] - 2025-07-06
### Added
- **Formspree Integration**: Implemented for waitlist form.
- **Client-side Form Handling**: Removed from `app.js`.

### Removed
- **Plan File**: `form-sub-implementation-plan.md` deleted.

### Changed
- **HTML Form**: Updated `action` and `method` attributes in `index.html`.

## [1.0.1] - 2025-07-05
### Changed
- **Business Name**: Updated to "Brush Concierge".
- **Domain**: `brushconcierge.com` acquired and linked.

### Added
- **GitHub Repository**: Initialized and pushed.

## [1.0.0] - 2025-07-05
### Added
- **Initial Deployment**: To Vercel.
- **Landing Page**: Complete implementation.
- **Waitlist Form**: With validation.
- **Mobile Responsiveness**: Design implemented.
- **Performance Optimization**: Applied.
- **Security Headers**: Implemented.
