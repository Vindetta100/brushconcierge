# Plan: Update Digital Wallets Section

This plan outlines the steps to update the "Digital Wallets" section in the `concierge/checkout.html` file to match the layout and icons from the `welcome/checkout.html` file.

## 1. Analyze `welcome/checkout.html`

I will examine the "Digital Wallets" section in the `welcome/checkout.html` file to understand its HTML structure and the CSS classes it uses.

**`welcome/checkout.html` (Digital Wallets section):**
```html
<div class="payment-method" data-method="digital">
    <div class="method-header">
        <input type="radio" id="digitalPayment" name="paymentMethod" value="digital">
        <label for="digitalPayment" class="method-label">
            <span class="method-icon">📱</span>
            Digital Wallets
        </label>
    </div>
    <div class="method-content">
        <div class="digital-options">
            <button type="button" class="digital-btn apple-pay" id="applePayBtn">
                <span class="digital-icon">🍎</span>
                Apple Pay
            </button>
            <button type="button" class="digital-btn google-pay" id="googlePayBtn">
                <span class="digital-icon">🟢</span>
                Google Pay
            </button>
            <button type="button" class="digital-btn paypal" id="paypalBtn">
                <span class="digital-icon">💙</span>
                PayPal
            </button>
        </div>
    </div>
</div>
```

## 2. Analyze `concierge/checkout.html`

I will examine the "Digital Wallets" section in the `concierge/checkout.html` file to identify the code that needs to be replaced.

**`concierge/checkout.html` (Digital Wallets section):**
```html
<div class="payment-method" data-method="digital">
    <input type="radio" id="paymentDigital" name="paymentMethod" value="digital">
    <label for="paymentDigital" class="payment-method-label">
        <div class="payment-method-content">
            <span class="payment-method-title">Digital Wallets</span>
            <div class="payment-method-icons">
                <img src="/concierge/img/apple-pay.svg" alt="Apple Pay" class="payment-icon">
                <img src="/concierge/img/google-pay.svg" alt="Google Pay" class="payment-icon">
                <img src="/concierge/img/paypal.svg" alt="PayPal" class="payment-icon">
            </div>
        </div>
    </label>
</div>
```

## 3. Update `concierge/checkout.html`

I will replace the existing "Digital Wallets" section in `concierge/checkout.html` with the HTML structure from `welcome/checkout.html`.

## 4. Update `concierge/checkout.css`

I will add the necessary CSS from `welcome/checkout.css` to `concierge/checkout.css` to style the new "Digital Wallets" section correctly. This will include styles for `.digital-options`, `.digital-btn`, and other related classes.

## 5. Update `CHANGELOG.md`

I will document the changes in the `CHANGELOG.md` file to maintain a record of the updates.

This plan will ensure that the "Digital Wallets" section in the concierge checkout is visually and functionally consistent with the welcome checkout.
