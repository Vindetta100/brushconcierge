const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { priceId } = req.query;

  if (!priceId) {
    return res.status(400).json({ error: 'Please provide a priceId in the query string. Example: /api/verify-price?priceId=price_123' });
  }

  try {
    // This line directly asks Stripe: "Does this price exist for this secret key?"
    const price = await stripe.prices.retrieve(priceId);
    
    // If it succeeds, it will show the price details
    res.status(200).json({ success: true, price: price });

  } catch (error) {
    // If it fails, it will show the exact error from Stripe
    console.error('Stripe API error during verification:', error);
    res.status(error.statusCode || 500).json({ 
      success: false,
      error: error.message,
      type: error.type 
    });
  }
}
