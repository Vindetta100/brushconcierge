# System Patterns: Brush Concierge

## System Architecture
- **Type**: Static Landing Page
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Hosting**: Vercel Static Site Deployment
- **Production URL**: https://brushconcierge.com/
- **CDN**: Cloudinary for images
- **Analytics**: Built-in click tracking (console logging, ready for GA)

## Key Technical Decisions
- **No Backend**: Purely client-side for MVP.
- **Vercel**: Chosen for ease of static site deployment and performance.
- **Vanilla JS**: Minimal dependencies for fast load times.
- **Mobile-First CSS**: Ensures responsiveness.

## Design Patterns in Use
- **Modular CSS**: Styles organized for readability.
- **Event Delegation**: For form submission and FAQ toggles in `app.js`.
- **Client-Side Validation**: For waitlist form.

## Component Relationships
- **index.html**: Main structure, links `style.css` and `app.js`.
- **style.css**: Defines visual presentation.
- **app.js**: Handles interactivity (form, FAQ, analytics).

## Critical Implementation Paths
- **Waitlist Form**: User input -> validation -> console log (future: external service).
- **Page Load**: HTML -> CSS -> JS -> content rendering.
- **Deployment**: Git push to GitHub -> Vercel auto-deploy.
