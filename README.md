# 🎨 Brush Concierge - Hybrid Stripe Integration

Professional makeup brush cleaning service with secure subscription payments.

## 🚀 Quick Deploy

1. **Get Stripe Keys**: [Dashboard](https://dashboard.stripe.com/apikeys)
2. **Deploy to Vercel**: Import this repo
3. **Add Environment Variables**:
   ```
   STRIPE_SECRET_KEY=sk_live_your_key
   STRIPE_PRICE_ID=price_your_price_id
   ```
4. **Go Live!** 🎉

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## ✨ Features

### Customer Experience
- **Beautiful 3-Step Checkout**: Information → Payment → Confirmation
- **Secure Stripe Payments**: Industry-standard security
- **Mobile Responsive**: Perfect on all devices
- **Real-time Validation**: Instant feedback on form errors

### Business Features
- **Subscription Management**: Automatic recurring billing
- **Customer Portal**: Stripe-hosted customer management
- **Webhook Integration**: Real-time payment notifications
- **Analytics Ready**: Track conversions and revenue

## 🛠 Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Vercel Serverless Functions
- **Payments**: Stripe Checkout & Subscriptions
- **Hosting**: Vercel (with custom domain support)

## 📁 Project Structure

```
brushconcierge-hybrid/
├── api/
│   ├── create-checkout-session.js  # Stripe checkout API
│   └── webhook.js                  # Webhook handler
├── checkout.html                   # 3-step checkout page
├── checkout.js                     # Checkout logic
├── index.html                      # Landing page
├── style.css                       # Global styles
├── vercel.json                     # Deployment config
├── .env.local.example              # Environment template
└── DEPLOYMENT_GUIDE.md             # Detailed setup guide
```

## 🔧 Development

### Local Setup
```bash
npm install
npm run dev
```

### Environment Variables
Copy `.env.local.example` to `.env.local` and add your Stripe keys.

### Testing
- Use Stripe test keys for development
- Test card: `4242 4242 4242 4242`
- All major payment methods supported

## 🔒 Security

- ✅ PCI DSS compliant via Stripe
- ✅ Environment variables for secrets
- ✅ HTTPS enforcement
- ✅ Input validation & sanitization
- ✅ Webhook signature verification

## 📈 Business Model

- **Monthly Subscription**: $19.99/month
- **Service**: Up to 20 makeup brushes cleaned professionally
- **Shipping**: Free both ways
- **Turnaround**: 5-7 business days

## 🎯 Conversion Optimized

- **Single Page Checkout**: Reduces abandonment
- **Progress Indicators**: Clear user journey
- **Mobile First**: 60%+ of traffic is mobile
- **Trust Signals**: Security badges and guarantees

## 📊 Analytics Integration Ready

Easy to add:
- Google Analytics
- Facebook Pixel
- Stripe Analytics
- Custom conversion tracking

## 🧪 A/B/C Testing

### Setup
- A/B/C testing implemented with 33/33/33 split
- Test different homepage versions via router
- Persistence via localStorage

### Running the Server
```bash
# Start local server
python3 -m http.server 8000

# Or with Node.js
npx http-server -p 8000
```

### Version Links
- **Random Assignment**: http://localhost:8000/
- **Version A (Classic)**: http://localhost:8000/classic/
- **Version B (Premium)**: http://localhost:8000/premium/
- **Version C (Concierge)**: http://localhost:8000/concierge/

### Local Testing Links
- **Version A (Classic)**: http://localhost:8000/set_version_a.html
- **Version B (Premium)**: http://localhost:8000/set_version_b.html
- **Version C (Concierge)**: http://localhost:8000/set_version_c.html

### Manual Testing
```javascript
// In browser console:
bcRouter.setVersion('A'); // Force Version A
bcRouter.setVersion('B'); // Force Version B
bcRouter.setVersion('C'); // Force Version C
bcRouter.resetVersion(); // Reset for random assignment
```

## 🆘 Support

1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Review Stripe Dashboard logs
3. Test with Stripe test cards
4. Contact Stripe support for payment issues

---

**Ready to launch your subscription business? Deploy now! 🚀**
