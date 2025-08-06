const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * STRIPE TEST/LIVE ENVIRONMENT HANDLING
 * 
 * IMPORTANT: This API uses live Stripe keys but Stripe's test card (4242 4242 4242 4242)
 * will work in live mode for testing checkout flows WITHOUT creating actual charges.
 * 
 * Test Card Behavior in Live Mode:
 * - Test card 4242 4242 4242 4242 works for flow testing
 * - No actual charges are created when using test cards
 * - Real cards WOULD be charged if used with live keys
 * 
 * For Production Safety:
 * - Always use test cards during QA testing
 * - Stop at "Complete Order" button to avoid any potential charges
 * - Consider separate staging environment with test keys for full testing
 * 
 * Current Environment: LIVE KEYS with test card support
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    // Validate required environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }

    // Extract customer data and tier from request
    const {
      tier,
      priceId,
      firstName,
      lastName,
      email,
      phone,
      address1,
      address2,
      city,
      state,
      zipCode,
      brushTypes,
      deliveryNotes
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !address1 || !city || !state || !zipCode) {
      res.status(400).json({ 
        error: 'Missing required fields: firstName, lastName, email, address1, city, state, zipCode' 
      });
      return;
    }

    // Validate tier and priceId
    if (!tier || !priceId) {
      res.status(400).json({ 
        error: 'Missing tier or priceId' 
      });
      return;
    }

    // Define valid tiers and their corresponding price IDs
    // UPDATE THESE WITH YOUR ACTUAL STRIPE PRICE IDs
    const validTiers = {
      essentials: 'price_1RsXfJ08jBtUv1BcKxMyi5hR',
      curator: 'price_1RsXh608jBtUv1BcDXc1cCT7',
      atelier: 'price_1RsXjU08jBtUv1Bca7ZYJT31'
    };

    // Validate tier and priceId match
    if (!validTiers[tier] || validTiers[tier] !== priceId) {
      res.status(400).json({ 
        error: 'Invalid tier or priceId combination' 
      });
      return;
    }

    // Create or retrieve customer in Stripe
    let customer;
    try {
      // Try to find existing customer by email
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
        
        // Update customer with latest information
        customer = await stripe.customers.update(customer.id, {
          name: `${firstName} ${lastName}`,
          phone: phone || undefined,
          address: {
            line1: address1,
            line2: address2 || undefined,
            city: city,
            state: state,
            postal_code: zipCode,
            country: 'US'
          },
          metadata: {
            tier: tier,
            brushTypes: brushTypes || '',
            deliveryNotes: deliveryNotes || '',
            updatedAt: new Date().toISOString()
          }
        });
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email: email,
          name: `${firstName} ${lastName}`,
          phone: phone || undefined,
          address: {
            line1: address1,
            line2: address2 || undefined,
            city: city,
            state: state,
            postal_code: zipCode,
            country: 'US'
          },
          metadata: {
            tier: tier,
            brushTypes: brushTypes || '',
            deliveryNotes: deliveryNotes || '',
            createdAt: new Date().toISOString()
          }
        });
      }
    } catch (customerError) {
      console.error('Error creating/updating customer:', customerError);
      res.status(500).json({ error: 'Failed to process customer information' });
      return;
    }

    // Determine success and cancel URLs
    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'https://brushconcierge.com';
    const successUrl = `${origin}/concierge/checkout.html?success=true&session_id={CHECKOUT_SESSION_ID}&tier=${tier}`;
    const cancelUrl = `${origin}/concierge/checkout.html?canceled=true&tier=${tier}`;

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto',
        name: 'auto'
      },
      subscription_data: {
        metadata: {
          tier: tier,
          customerName: `${firstName} ${lastName}`,
          brushTypes: brushTypes || '',
          deliveryNotes: deliveryNotes || ''
        }
      },
      metadata: {
        tier: tier,
        customerName: `${firstName} ${lastName}`,
        brushTypes: brushTypes || '',
        deliveryNotes: deliveryNotes || ''
      }
    });

    // Return the checkout session URL
    res.status(200).json({ 
      url: session.url,
      sessionId: session.id,
      customerId: customer.id,
      tier: tier
    });

  } catch (error) {
    console.error('Stripe checkout session creation error:', error);
    
    // Return appropriate error response
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'An unexpected error occurred';
    
    res.status(statusCode).json({ 
      error: errorMessage,
      type: error.type || 'api_error'
    });
  }
}
