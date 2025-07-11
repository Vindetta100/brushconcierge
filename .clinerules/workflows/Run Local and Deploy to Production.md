# Run Local and Deploy to Production Workflow

## Purpose
- Launch `brush-bliss` locally.
- Deploy `brush-bliss` to Vercel.
- Avoid repetitive instructions.

## Prerequisites
- ### Node.js
    - Version >= 14.0.0.
- ### npm
    - Version >= 6.0.0.
- ### Vercel CLI
    - Install globally: `npm install -g vercel`.
- ### serve CLI
    - Install globally: `npm install -g serve`.

## Local Development Steps
- ### Navigate
    - `cd brush-bliss`.
- ### Start Server
    - `npx serve .`.
- ### Open Browser
    - `http://localhost:3000`.

## Deployment Steps

### Initial Setup (if redeploying from scratch)
- ### Navigate
    - `cd brush-bliss`.
- ### Login
    - `vercel login`.
- ### Initialize Project
    - `vercel --name brush-bliss`.
- ### Deploy Production
    - `vercel --prod`.

### Regular Redeployment (after making changes)
- ### Navigate
    - `cd brush-bliss`.
- ### Deploy Changes
    - `vercel --prod`.
- ### Automatic Deployment (Git)
    - `git add .`.
    - `git commit -m "Update: [describe changes]"`.
    - `git push origin main`.

## Troubleshooting
- ### Port Conflict
    - Check terminal for alternative port.
- ### Caching Issues
    - Clear browser cache.
- ### Deployment Fails
    - `vercel --version`.
    - `vercel logout` then `vercel login`.
    - `vercel --prod --force`.
- ### Images Not Loading
    - Verify Cloudinary URLs.
    - Check CORS issues.
    - Confirm image paths.
- ### Form Not Working
    - Check JavaScript loading.
    - Review console errors.
    - Verify validation logic.
    - Confirm analytics tracking.
