## What Works
- Initial landing page deployment.
- Formspree integration for waitlist (form submission itself works).
- Security scan completed with no critical findings.
- Text-based logo "Brush Concierge - TEST1" added and verified locally and on production.
- `README.md` updated with correct local development instructions and comprehensive Vercel deployment guidance for AI.
- Local changes successfully deployed to Vercel production, and custom domain updates are now reflecting correctly.

## What's Left to Build
- **Formspree Data Reception**: User is not receiving waitlist data.

## Current Status
- Vercel deployment and custom domain update issues are resolved.
- `README.md` is fully updated for AI guidance.
- Formspree data reception issue requires further investigation by the user.

## Known Issues
- Formspree submissions going to spam/not being received by the user.

## Evolution of Project Decisions
- Switched from custom form handling to Formspree for waitlist.
- Opted for text-based logo for quick implementation and theme consistency.
- Updated local development instructions in `README.md` for clarity and AI guidance.
- Confirmed direct local `vercel --prod` deployment workflow and addressed caching/DNS propagation.
