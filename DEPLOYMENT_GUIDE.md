# 🚀 Brush Concierge - Deployment Guide

## Quick Start (5 Minutes to Live!)

### Step 1: Get Your Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`)

### Step 2: Create Your Subscription Product
1. Go to [Stripe Products](https://dashboard.stripe.com/products)
2. Click "Add Product"
3. Name: "Brush Concierge Monthly Subscription"
4. Price: $19.99/month (recurring)
5. Copy the **Price ID** (starts with `price_`)

### Step 3: Deploy to Vercel
1. Push this code to your GitHub repository
2. Go to [Vercel](https://vercel.com) and import your repo
3. In Vercel project settings, add these Environment Variables:
   ```
   STRIPE_SECRET_KEY=sk_live_your_secret_key_here
   STRIPE_PRICE_ID=price_your_price_id_here
   ```
4. Deploy!

### Step 4: Set Up Webhooks (Optional but Recommended)
1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-domain.vercel.app/api/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
4. Copy the webhook secret and add to Vercel:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

## 🎉 You're Live!

Your subscription service is now accepting real payments at your Vercel URL!

---

## Detailed Configuration

### Environment Variables Reference
```bash
# Required
STRIPE_SECRET_KEY=sk_live_xxxxx    # Your Stripe secret key
STRIPE_PRICE_ID=price_xxxxx        # Your subscription price ID

# Optional (for webhooks)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # Webhook endpoint secret
```

### Testing vs Production

#### Test Mode
- Use keys starting with `sk_test_` and `pk_test_`
- Use test card: `4242 4242 4242 4242`
- No real charges are made

#### Production Mode
- Use keys starting with `sk_live_` and `pk_live_`
- Real payments will be processed
- Ensure you've tested thoroughly!

### Security Features Included
✅ Environment variables for sensitive data  
✅ HTTPS enforcement  
✅ CORS protection  
✅ Input validation  
✅ Webhook signature verification  
✅ Security headers configured  

### What Happens When Someone Subscribes
1. Customer fills out your beautiful 3-step form
2. Redirected to Stripe Checkout for secure payment
3. Stripe processes the payment
4. Customer redirected back to success page
5. Webhook notifies your system (if configured)
6. Customer receives email receipt from Stripe

### Customization Options

#### Change Pricing
1. Create new price in Stripe Dashboard
2. Update `STRIPE_PRICE_ID` environment variable
3. Redeploy

#### Modify Subscription Details
Edit the subscription details in `/api/create-checkout-session.js`:
- Trial periods
- Promotional codes
- Custom metadata

#### Update Success/Cancel URLs
The system automatically uses your domain, but you can customize the redirect URLs in the API endpoint.

### Monitoring & Analytics
- View subscriptions in Stripe Dashboard
- Monitor payments and failed charges
- Export customer data
- Set up email notifications

### Support & Maintenance
- Stripe handles PCI compliance
- Automatic security updates
- 99.9% uptime SLA from Vercel
- Built-in error handling and logging

---

## 🆘 Troubleshooting

### Common Issues

**"No such price" error**
- Verify your `STRIPE_PRICE_ID` is correct
- Ensure the price exists in your Stripe account

**"Invalid API key" error**
- Check your `STRIPE_SECRET_KEY` is correct
- Ensure you're using the right test/live key

**Webhook not working**
- Verify webhook URL is correct
- Check webhook secret matches
- Ensure endpoint is publicly accessible

### Getting Help
1. Check Stripe Dashboard logs
2. Check Vercel function logs
3. Test with Stripe's test cards
4. Contact Stripe support for payment issues

---

## 📊 What's Included

### Frontend Features
- ✅ Beautiful 3-step checkout flow
- ✅ Form validation and error handling
- ✅ Mobile-responsive design
- ✅ Progress indicators
- ✅ Success/cancel page handling

### Backend Features
- ✅ Secure Stripe integration
- ✅ Customer creation/updating
- ✅ Subscription management
- ✅ Webhook handling
- ✅ Error logging

### Security & Compliance
- ✅ PCI DSS compliant (via Stripe)
- ✅ HTTPS encryption
- ✅ Secure environment variables
- ✅ Input sanitization
- ✅ CORS protection

**You're ready to start accepting subscriptions! 🎉**

