# Project Handover Plan: Brush Concierge (Live Version)

## Objective
The goal of this plan is to create a clean, self-contained package of the live "Concierge" version of the Brush Concierge website. This package will exclude all other A/B testing versions (Version A and B) and any non-essential development or documentation files, providing a streamlined project for handover.

## Confirmed Live Version
Through analysis of `router.js`, it has been confirmed that **Version C (Concierge)** is the currently active and live version of the website, as all traffic is explicitly routed to the `/concierge/` path.

## Proposed Files and Directories for Inclusion (The Clean Handover Package)

The following files and directories are considered essential for the functionality of the live Concierge website and will be included in the handover package:

*   **`concierge/`**: This entire directory, containing all HTML, CSS, JavaScript, and image assets specific to the Concierge version.
    *   `concierge/app.js`
    *   `concierge/checkout.css`
    *   `concierge/checkout.html`
    *   `concierge/checkout.js`
    *   `concierge/contact.html`
    *   `concierge/index.html`
    *   `concierge/router.js`
    *   `concierge/style.css`
    *   `concierge/img/` (all contents)
*   **`api/`**: This entire directory, containing backend API endpoints crucial for functionalities like Stripe integration.
    *   `api/create-checkout-session.js`
    *   `api/verify-price.js`
    *   `api/webhook.js`
*   **`package.json`**: Essential for managing project dependencies.
*   **`package-lock.json`**: Ensures consistent dependency installations.
*   **`vercel.json`**: Configuration file for Vercel deployment.
*   **`router.js`**: The main routing logic that directs to the Concierge version.

## Proposed Files and Directories for Exclusion (Considered "Garbage" for Handover)

The following items are considered non-essential for the live Concierge website's operation or are related to older versions/development processes and will be *excluded* from the handover package:

*   **Version-specific directories (A/B Testing):**
    *   `classic/` (Version A)
    *   `home/`
    *   `index/` (Older A/B testing setup)
    *   `premium/` (Version B)
    *   `welcome/` (Another potential version or old setup)
*   **Redundant Root-Level Files (superseded by `concierge/` versions):**
    *   `app.js`
    *   `checkout.css`
    *   `checkout.html`
    *   `checkout.js`
    *   `style.css`
    *   `img/` (Root level - if images are duplicated in `concierge/img/`, these are redundant)
*   **A/B Testing Related HTML Files:**
    *   `set_version_a.html`
    *   `set_version_b.html`
    *   `set_version_c.html`
    *   `index_router.html`
*   **Documentation, Plans, and Development Artifacts:**
    *   `.gitignore` (Can be recreated if a new Git repo is initialized)
    *   `ai-website-review.md`
    *   `Brush Concierge - Version C.md`
    *   `brush_concierge_checkout_complete.zip`
    *   `CHANGELOG.md`
    *   `contact-us-implementation-plan.md`
    *   `DEPLOYMENT_GUIDE.md`
    *   `digital-wallet-icon-plan.md`
    *   `digital-wallet-plan.md`
    *   `git-recover.md`
    *   `icon-fixes-implementation-plan.md`
    *   `implementation-plan.md`
    *   `legal.html` (Unless a standalone legal page at the root is specifically required; legal content should ideally be within the Concierge version's structure.)
    *   `Privacy Policy Implementation Plan.md`
    *   `README.md`
    *   `REVERT_INSTRUCTIONS.md`
    *   `review-plan-checklist.md`
    *   `verification-report.md`
    *   `verify.md`
    *   `deletion_recommendations.md` (This plan itself)

## What will happen with the Handover Package and Your Current Project?

Once you approve this plan, I will perform the following steps to facilitate the handover and manage your current project:

1.  **Create New Primary Project Directory:** A new directory, for example, `brush-bliss-concierge-live/`, will be created at the root of your current workspace. This will be the clean, streamlined project for the new developer.
2.  **Copy Essential Files:** Only the files and directories listed under "Proposed Files and Directories for Inclusion" will be copied into this new `brush-bliss-concierge-live/` directory.
3.  **Rename Current Project to Backup:** Your current project directory (`/Users/vinhpham/Desktop/projects/brush-bliss`) will be renamed to `brush-bliss-backup-full-project/`. This ensures you retain a complete backup of all versions and development history.
4.  **Initialize New Git Repository:** A new Git repository will be initialized within `brush-bliss-concierge-live/` with an initial commit, providing a clean version history for the recipient. This is our recommended approach for a clean handover.

## Pre-Deployment Setup for New Developer

Before deploying to Vercel, the new developer must perform the following setup steps:

*   **System Prerequisite: Install Node.js:** This project requires Node.js to be installed, which includes the `npm` and `npx` command-line tools. The new developer can download and install it from the official website: [https://nodejs.org/](https://nodejs.org/)

*   **Install Dependencies:** Navigate into the `brush-bliss-concierge-live/` directory and run the following command to install the required Node.js packages:
    ```bash
    npm install
    ```
*   **Configure Environment Variables:** The project requires a Stripe Secret Key for payment processing.
    *   **Why is this needed?** This key is a secret credential that allows the application to securely communicate with the Stripe API. Exposing it in the source code would be a major security risk. Using an environment variable keeps it secure.
    *   **Action Required:** When deploying to Vercel, this variable must be added to the Vercel project's "Environment Variables" settings. You will need to provide the new developer with the correct Stripe secret key. The variable name should be `STRIPE_SECRET_KEY`.

5.  **Running and Deploying the Project:**
    *   **Running Locally for Development:** To test the site on a local machine, navigate into the `brush-bliss-concierge-live/` directory. You can use either of the following commands to start a local server.
         ```bash
         # Recommended: Use the project's built-in script
         npm run dev

         # Alternative: Directly run the server with npx
         npx serve .
         ```
    *   **Deploying to Production:** The new developer will need to deploy this `brush-bliss-concierge-live/` directory to Vercel.
        *   **Steps for Vercel Deployment:**
            1.  Navigate into the new `brush-bliss-concierge-live/` directory in their terminal.
            2.  Ensure they have the Vercel CLI installed (`npm i -g vercel`).
            3.  Run `vercel --prod` to deploy the site to production. They will be guided through linking the project to their Vercel account and setting up the domain.
6.  **Handover:** The `brush-bliss-concierge-live/` directory, now ready for Vercel deployment, will be the primary project for the new developer to take over, including site management.

This revised process ensures a clean, focused handover while preserving your full project as a backup, and provides clear instructions for the new developer to get the site running.

## Next Steps for You
Please review this `handover-plan.md` file. Once you are satisfied with the proposed inclusions and exclusions, please let me know your approval.