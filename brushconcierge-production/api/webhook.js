const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).json({ error: `Webhook Error: ${err.message}` });
    return;
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        
        // Here you could:
        // - Send welcome email
        // - Create user account in your database
        // - Trigger fulfillment process
        // - Update analytics
        
        break;

      case 'customer.subscription.created':
        const subscription = event.data.object;
        console.log('Subscription created:', subscription.id);
        
        // Handle new subscription
        // - Send confirmation email
        // - Set up customer account
        // - Schedule first shipment
        
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object;
        console.log('Subscription updated:', updatedSubscription.id);
        
        // Handle subscription changes
        // - Update customer status
        // - Adjust shipping schedule
        
        break;

      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object;
        console.log('Subscription canceled:', canceledSubscription.id);
        
        // Handle subscription cancellation
        // - Send cancellation confirmation
        // - Stop future shipments
        // - Collect feedback
        
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log('Payment succeeded for invoice:', invoice.id);
        
        // Handle successful payment
        // - Send receipt
        // - Trigger shipment for recurring payments
        
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        console.log('Payment failed for invoice:', failedInvoice.id);
        
        // Handle failed payment
        // - Send payment failure notification
        // - Pause subscription if needed
        
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

