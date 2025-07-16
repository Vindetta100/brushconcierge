const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

    if (!process.env.STRIPE_PRICE_ID) {
      throw new Error('STRIPE_PRICE_ID environment variable is not set');
    }

    // Extract customer data from request
    const {
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
    const successUrl = `${origin}/checkout.html?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/checkout.html?canceled=true`;

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
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
          customerName: `${firstName} ${lastName}`,
          brushTypes: brushTypes || '',
          deliveryNotes: deliveryNotes || ''
        }
      },
      metadata: {
        customerName: `${firstName} ${lastName}`,
        brushTypes: brushTypes || '',
        deliveryNotes: deliveryNotes || ''
      }
    });

    // Return the checkout session URL
    res.status(200).json({ 
      url: session.url,
      sessionId: session.id,
      customerId: customer.id
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

