# Stripe Integration Plan: From Static to Serverless

## Phase 1: Stripe Account & Product Setup

### 1. Create Stripe Account
- **Action**: Go to `stripe.com` and sign up.
- **Action**: Complete the account setup and verification process.

### 2. Set Up Product in Stripe
- **Action**: In your Stripe Dashboard, navigate to `Products`.
- **Action**: Create a new product for the "Brush Concierge" subscription.
- **Action**: Define the pricing plan: $19.99/month.
- **Note**: Take note of the Price ID (e.g., `price_...`), you will need it later.

### 3. Get API Keys
- **Action**: In the Stripe Dashboard, go to `Developers` > `API keys`.
- **Action**: Copy the **Publishable key** (starts with `pk_test_...`).
- **Action**: Copy the **Secret key** (starts with `sk_test_...`). **DO NOT** share this key publicly.

## Phase 2: Backend Implementation (Vercel Serverless Function)

### 4. Project Setup
- **Action**: Create a new directory named `api` in the root of the project.
- **Action**: Install the Stripe Node.js library by running: `npm install stripe`.

### 5. Create the Serverless Function
- **Action**: Inside the `api` directory, create a new file named `create-checkout-session.js`.
- **Action**: Add the following Node.js code to this file. This code will create a Stripe Checkout session securely on the server.

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID from your Stripe product
            price: 'YOUR_PRICE_ID_HERE', 
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
```

### 6. Securely Manage API Keys
- **Action**: Create a file named `.env.local` in the project root.
- **Action**: Add your Stripe Secret Key to this file: `STRIPE_SECRET_KEY='your_sk_test_key_here'`.
- **Action**: **Crucially**, add `.env.local` to your `.gitignore` file to prevent it from being committed.
- **Action (for Production)**: In your Vercel project settings, navigate to `Settings` > `Environment Variables` and add `STRIPE_SECRET_KEY` with your live secret key value.

## Phase 3: Frontend Integration

### 7. Update `checkout.html`
- **Action**: Modify the checkout button to be part of a form that POSTs to the new API endpoint.

```html
<!-- Example Form Structure in checkout.html -->
<form action="/api/create-checkout-session" method="POST">
  <button type="submit">Subscribe Now</button>
</form>
```

### 8. Remove Old `checkout.js` Logic
- **Action**: The client-side `checkout.js` file is no longer needed to handle the Stripe redirect. The form submission now handles this.
- **Action**: You can remove the old Stripe-related JavaScript from `checkout.js` or delete the file if it serves no other purpose.

## Summary
This plan transitions the project from a static site to one with a secure, serverless backend capable of handling subscription payments via Stripe. The junior agents can follow these steps to implement the full checkout flow.
