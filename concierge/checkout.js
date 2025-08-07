// Checkout Page JavaScript
class CheckoutManager {
    constructor() {
        this.currentStep = 1;
        this.formData = {};
        this.tierData = {
            essentials: {
                name: 'The Essentials',
                price: 39.00,
                priceId: 'price_1RsXfJ08jBtUv1BcKxMyi5hR', // UPDATE THIS WITH YOUR STRIPE PRICE ID
                features: [
                    '10 brushes (any size)',
                    'Monthly service',
                    'Free shipping both ways',
                    '5-7 day turnaround',
                    'Pause or cancel anytime'
                ]
            },
            curator: {
                name: 'The Curator',
                price: 59.00,
                priceId: 'price_1RsXh608jBtUv1BcDXc1cCT7', // UPDATE THIS WITH YOUR STRIPE PRICE ID
                features: [
                    '20 brushes (any size)',
                    'Bi-weekly option available',
                    'Priority processing',
                    'Brush conditioning treatment',
                    'Free shipping both ways'
                ]
            },
            atelier: {
                name: 'The Atelier',
                price: 99.00,
                priceId: 'price_1RsXjU08jBtUv1Bca7ZYJT31', // UPDATE THIS WITH YOUR STRIPE PRICE ID
                features: [
                    'Up to 40 brushes',
                    'Bi-weekly service available',
                    'Premium handling & care',
                    'Priority support',
                    'Secure, elegant packaging'
                ]
            }
        };
        this.selectedTier = 'curator'; // Default tier

        this.init();
    }

    init() {
        this.initializeTier();
        this.bindEvents();
        this.initializeForm();
        this.updateProgressIndicator();
        this.initializeSummaryToggle();
        this.handleReturnFromStripe();
    }

    initializeTier() {
        const urlParams = new URLSearchParams(window.location.search);
        const tier = urlParams.get('tier');
        if (tier && this.tierData[tier]) {
            this.selectedTier = tier;
        }
        this.updateOrderSummary();
    }

    updateOrderSummary() {
        const tier = this.tierData[this.selectedTier];
        if (!tier) return;

        // Update service info in the order summary
        const serviceInfo = document.querySelector('.order-summary .service-info');
        if (serviceInfo) {
            serviceInfo.querySelector('h3').textContent = `${tier.name} Subscription`;
            const featureList = serviceInfo.querySelector('.service-features');
            if (featureList) {
                featureList.innerHTML = tier.features.map(feature => `<li>✓ ${feature}</li>`).join('');
            }
        }

        // Update pricing breakdown in the order summary
        const monthlyPrice = document.getElementById('monthlyPrice');
        const totalAmount = document.getElementById('totalAmount');
        const billingNote = document.getElementById('billingNote');
        
        if (monthlyPrice) {
            monthlyPrice.textContent = `$${tier.price.toFixed(2)}`;
        }
        if (totalAmount) {
            totalAmount.textContent = `$${tier.price.toFixed(2)}`;
        }
        if (billingNote) {
            billingNote.innerHTML = `
                <strong>First box ships immediately</strong><br>
                Then billed monthly at $${tier.price.toFixed(2)}
            `;
        }

        // Update final total in the review step
        const finalTotalPrice = document.getElementById('finalTotalPrice');
        const recurringPrice = document.getElementById('recurringPrice');
        if (finalTotalPrice) {
            finalTotalPrice.textContent = `$${tier.price.toFixed(2)}`;
        }
        if (recurringPrice) {
            recurringPrice.textContent = `Then $${tier.price.toFixed(2)}/month`;
        }
        
        // Update subscription details in the review step
        const subscriptionReview = document.getElementById('subscriptionReview');
        if (subscriptionReview) {
            subscriptionReview.innerHTML = `
                <p><strong>${tier.name}</strong></p>
                <p>$${tier.price.toFixed(2)}/month • ${tier.features[0]} • Free shipping both ways</p>
                <p>First box ships within 2-3 business days</p>
            `;
        }
        
        // Update subscription terms
        const subscriptionTerms = document.getElementById('subscriptionTerms');
        if (subscriptionTerms) {
            subscriptionTerms.textContent = `I understand this is a monthly subscription that will automatically renew at $${tier.price.toFixed(2)}/month until I cancel`;
        }
    }

    handleReturnFromStripe() {
        // Check URL parameters for Stripe return
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        const canceled = urlParams.get('canceled');
        const sessionId = urlParams.get('session_id');
        
        if (success === 'true') {
            // Show success modal
            this.showSuccessModal();
            
            // Clear saved form data
            localStorage.removeItem('checkoutFormData');
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (canceled === 'true') {
            // Show cancellation message
            alert('Payment was canceled. You can continue where you left off.');
            
            // Restore form data if available
            this.populateFormFromStorage();
            
            // Go to the last step
            this.goToStep(3);
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    bindEvents() {
        // Step navigation
        document.getElementById('continueToPayment')?.addEventListener('click', () => this.validateAndContinue(1));
        document.getElementById('backToInfo')?.addEventListener('click', () => this.goToStep(1));
        document.getElementById('reviewOrder')?.addEventListener('click', () => this.validateAndContinue(2));
        document.getElementById('backToPayment')?.addEventListener('click', () => this.goToStep(2));
        
        // Form submission
        document.getElementById('checkoutForm')?.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Payment method selection
        document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
            radio.addEventListener('change', () => this.handlePaymentMethodChange());
        });
        
        // Billing address toggle
        document.getElementById('sameAsShipping')?.addEventListener('change', (e) => {
            this.toggleBillingAddress(e.target.checked);
        });
        
        // Terms acceptance validation
        document.getElementById('agreeTerms')?.addEventListener('change', () => this.validateTermsAcceptance());
        document.getElementById('agreeSubscription')?.addEventListener('change', () => this.validateTermsAcceptance());
        
        // Form validation on input
        this.bindFormValidation();
        
        // Card input formatting
        this.bindCardFormatting();
        
        // Digital payment buttons
        this.bindDigitalPayments();
    }

    initializeForm() {
        // Pre-populate form with any existing data
        this.populateFormFromStorage();
        
        // Set up real-time validation
        this.setupRealTimeValidation();
    }

    initializeSummaryToggle() {
        const toggle = document.getElementById('summaryToggle');
        const content = document.getElementById('summaryContent');
        
        if (toggle && content) {
            // Show summary by default on desktop, hidden on mobile
            if (window.innerWidth <= 768) {
                content.classList.remove('show');
                toggle.querySelector('span').textContent = 'Show Details';
            } else {
                content.classList.add('show');
                toggle.querySelector('span').textContent = 'Hide Details';
            }
            
            toggle.addEventListener('click', () => {
                content.classList.toggle('show');
                const isShown = content.classList.contains('show');
                toggle.querySelector('span').textContent = isShown ? 'Hide Details' : 'Show Details';
                toggle.classList.toggle('expanded', isShown);
            });
        }
    }

    goToStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show target step
        const targetStep = document.getElementById(`step${stepNumber}`);
        if (targetStep) {
            targetStep.classList.add('active');
            targetStep.classList.add('fade-in');
        }
        
        this.currentStep = stepNumber;
        this.updateProgressIndicator();
        
        // Scroll to top of form
        document.querySelector('.checkout-form-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        // Update review content if going to step 3
        if (stepNumber === 3) {
            this.updateReviewContent();
            // Validate terms acceptance when reaching final step
            this.validateTermsAcceptance();
        }
    }

    validateAndContinue(fromStep) {
        if (fromStep === 1) {
            if (this.validateStep1()) {
                this.saveFormData();
                this.goToStep(2);
            }
        } else if (fromStep === 2) {
            if (this.validateStep2()) {
                this.saveFormData();
                this.goToStep(3);
            }
        }
    }

    validateStep1() {
        const requiredFields = [
            'firstName', 'lastName', 'email', 
            'address1', 'city', 'state', 'zipCode'
        ];
        
        let isValid = true;
        
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const value = field?.value.trim();
            
            if (!value) {
                this.showFieldError(fieldName, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(fieldName);
                
                // Additional validation
                if (fieldName === 'email' && !this.isValidEmail(value)) {
                    this.showFieldError(fieldName, 'Please enter a valid email address');
                    isValid = false;
                }
                
                if (fieldName === 'zipCode' && !this.isValidZipCode(value)) {
                    this.showFieldError(fieldName, 'Please enter a valid ZIP code');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }

    validateStep2() {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        
        if (paymentMethod === 'card') {
            return this.validateCardDetails();
        } else if (paymentMethod === 'digital') {
            // Digital payments are handled separately
            return true;
        }
        
        return false;
    }

    validateCardDetails() {
        const requiredFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        let isValid = true;
        
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const value = field?.value.trim();
            
            if (!value) {
                this.showFieldError(fieldName, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(fieldName);
                
                // Additional validation
                if (fieldName === 'cardNumber' && !this.isValidCardNumber(value)) {
                    this.showFieldError(fieldName, 'Please enter a valid card number');
                    isValid = false;
                }
                
                if (fieldName === 'expiryDate' && !this.isValidExpiryDate(value)) {
                    this.showFieldError(fieldName, 'Please enter a valid expiry date');
                    isValid = false;
                }
                
                if (fieldName === 'cvv' && !this.isValidCVV(value)) {
                    this.showFieldError(fieldName, 'Please enter a valid CVV');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }

    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        if (field) {
            field.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        if (field) {
            field.classList.remove('error');
        }
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    updateProgressIndicator() {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            
            step.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            }
        });
    }

    validateTermsAcceptance() {
        const termsChecked = document.getElementById('agreeTerms')?.checked;
        const subscriptionChecked = document.getElementById('agreeSubscription')?.checked;
        const completeOrderBtn = document.getElementById('completeOrder');
        
        if (completeOrderBtn) {
            const bothTermsAccepted = termsChecked && subscriptionChecked;
            completeOrderBtn.disabled = !bothTermsAccepted;
            
            // Add visual feedback
            if (bothTermsAccepted) {
                completeOrderBtn.classList.add('enabled');
                completeOrderBtn.classList.remove('disabled');
            } else {
                completeOrderBtn.classList.add('disabled');
                completeOrderBtn.classList.remove('enabled');
            }
        }
    }

    handlePaymentMethodChange() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        
        document.querySelectorAll('.payment-method').forEach(method => {
            method.classList.remove('active');
        });
        
        const activeMethod = document.querySelector(`[data-method="${selectedMethod}"]`);
        if (activeMethod) {
            activeMethod.classList.add('active');
        }
    }

    toggleBillingAddress(sameAsShipping) {
        const billingForm = document.getElementById('billingAddressForm');
        
        if (billingForm) {
            billingForm.style.display = sameAsShipping ? 'none' : 'block';
            
            if (sameAsShipping) {
                // Copy shipping address to billing
                this.copyShippingToBilling();
            }
        }
    }

    copyShippingToBilling() {
        const mappings = {
            'address1': 'billingAddress1',
            'address2': 'billingAddress2',
            'city': 'billingCity',
            'state': 'billingState',
            'zipCode': 'billingZipCode'
        };
        
        Object.entries(mappings).forEach(([shipping, billing]) => {
            const shippingField = document.getElementById(shipping);
            const billingField = document.getElementById(billing);
            
            if (shippingField && billingField) {
                billingField.value = shippingField.value;
            }
        });
    }

    bindFormValidation() {
        // Real-time validation for key fields
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('blur', () => {
                const value = emailField.value.trim();
                if (value && !this.isValidEmail(value)) {
                    this.showFieldError('email', 'Please enter a valid email address');
                } else if (value) {
                    this.clearFieldError('email');
                }
            });
        }
        
        const zipField = document.getElementById('zipCode');
        if (zipField) {
            zipField.addEventListener('input', () => {
                const value = zipField.value.replace(/\D/g, '');
                zipField.value = value.substring(0, 5);
            });
        }
    }

    bindCardFormatting() {
        const cardNumberField = document.getElementById('cardNumber');
        const expiryField = document.getElementById('expiryDate');
        const cvvField = document.getElementById('cvv');
        
        if (cardNumberField) {
            cardNumberField.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                e.target.value = value.substring(0, 19);
                
                // Update card type icon
                this.updateCardTypeIcon(value.replace(/\s/g, ''));
            });
        }
        
        if (expiryField) {
            expiryField.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }
        
        if (cvvField) {
            cvvField.addEventListener('input', (e) => {
                const value = e.target.value.replace(/\D/g, '');
                e.target.value = value.substring(0, 4);
            });
        }
    }

    bindDigitalPayments() {
        // Apple Pay button
        const applePayBtn = document.getElementById('applePayBtn');
        if (applePayBtn) {
            applePayBtn.addEventListener('click', () => this.handleApplePay());
        }
        
        // Google Pay button
        const googlePayBtn = document.getElementById('googlePayBtn');
        if (googlePayBtn) {
            googlePayBtn.addEventListener('click', () => this.handleGooglePay());
        }
        
        // PayPal button
        const paypalBtn = document.getElementById('paypalBtn');
        if (paypalBtn) {
            paypalBtn.addEventListener('click', () => this.handlePayPal());
        }
    }

    updateCardTypeIcon(cardNumber) {
        const iconElement = document.getElementById('cardTypeIcon');
        if (!iconElement) return;
        
        const cardType = this.getCardType(cardNumber);
        const icons = {
            'visa': '💳',
            'mastercard': '💳',
            'amex': '💳',
            'discover': '💳',
            'unknown': '💳'
        };
        
        iconElement.textContent = icons[cardType] || icons.unknown;
    }

    getCardType(cardNumber) {
        const patterns = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/,
            discover: /^6(?:011|5)/
        };
        
        for (const [type, pattern] of Object.entries(patterns)) {
            if (pattern.test(cardNumber)) {
                return type;
            }
        }
        
        return 'unknown';
    }

    saveFormData() {
        const formData = this.collectFormData();
        localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    }

    populateFormFromStorage() {
        try {
            const savedData = localStorage.getItem('checkoutFormData');
            if (savedData) {
                const formData = JSON.parse(savedData);
                
                Object.entries(formData).forEach(([key, value]) => {
                    const field = document.getElementById(key);
                    if (field && value) {
                        if (field.type === 'checkbox') {
                            field.checked = value;
                        } else {
                            field.value = value;
                        }
                    }
                });
            }
        } catch (e) {
            console.error('Error loading saved form data:', e);
        }
    }

    setupRealTimeValidation() {
        // Add real-time validation for better UX
        const form = document.getElementById('checkoutForm');
        if (form) {
            form.addEventListener('input', (e) => {
                const field = e.target;
                if (field.classList.contains('error')) {
                    // Re-validate field if it was previously in error state
                    setTimeout(() => {
                        if (field.value.trim()) {
                            this.clearFieldError(field.id);
                        }
                    }, 500);
                }
            });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate final step
        const termsChecked = document.getElementById('agreeTerms')?.checked;
        const subscriptionChecked = document.getElementById('agreeSubscription')?.checked;
        
        if (!termsChecked || !subscriptionChecked) {
            alert('Please agree to the terms and conditions to continue.');
            return;
        }
        
        // Show loading state
        const submitBtn = document.getElementById('completeOrder');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'Processing...';
        }
        
        try {
            // Process payment through Stripe
            await this.processStripePayment();
            
        } catch (error) {
            console.error('Payment processing error:', error);
            
            // Show user-friendly error message
            const errorMessage = error.message || 'There was an error processing your payment. Please try again.';
            alert(errorMessage);
            
        } finally {
            // Remove loading state
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = 'Complete Order';
            }
        }
    }

    async processStripePayment() {
        // Collect all form data
        const formData = this.collectFormData();
        
        // Validate required fields one more time
        if (!this.validateFormData(formData)) {
            throw new Error('Please fill in all required fields correctly.');
        }
        
        try {
            // Call our API endpoint to create Stripe checkout session
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            // Check if response is ok
            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                
                // Try to parse error response as JSON
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (parseError) {
                    // If JSON parsing fails, try to get text
                    try {
                        const errorText = await response.text();
                        if (errorText && !errorText.includes('<html')) {
                            errorMessage = errorText;
                        }
                    } catch (textError) {
                        // Use default error message
                    }
                }
                
                throw new Error(errorMessage);
            }
            
            // Parse successful response
            const responseData = await response.json();
            const { url } = responseData;
            
            if (!url) {
                throw new Error('No checkout URL received from server');
            }
            
            // Save form data before redirecting
            this.saveFormData();
            
            // Redirect to Stripe Checkout
            window.location.href = url;
            
        } catch (error) {
            console.error('Stripe payment processing error:', error);
            throw error;
        }
    }

    collectFormData() {
        const tier = this.tierData[this.selectedTier];
        return {
            tier: this.selectedTier,
            priceId: tier.priceId,
            firstName: document.getElementById('firstName')?.value?.trim() || '',
            lastName: document.getElementById('lastName')?.value?.trim() || '',
            email: document.getElementById('email')?.value?.trim() || '',
            phone: document.getElementById('phone')?.value?.trim() || '',
            address1: document.getElementById('address1')?.value?.trim() || '',
            address2: document.getElementById('address2')?.value?.trim() || '',
            city: document.getElementById('city')?.value?.trim() || '',
            state: document.getElementById('state')?.value || '',
            zipCode: document.getElementById('zipCode')?.value?.trim() || '',
            brushTypes: document.getElementById('brushTypes')?.value?.trim() || '',
            deliveryNotes: document.getElementById('deliveryNotes')?.value?.trim() || '',
            marketingEmails: document.getElementById('marketingEmails')?.checked || false
        };
    }

    validateFormData(data) {
        const requiredFields = ['firstName', 'lastName', 'email', 'address1', 'city', 'state', 'zipCode'];
        
        for (const field of requiredFields) {
            if (!data[field]) {
                console.error(`Missing required field: ${field}`);
                return false;
            }
        }
        
        // Validate email format
        if (!this.isValidEmail(data.email)) {
            console.error('Invalid email format');
            return false;
        }
        
        // Validate ZIP code format
        if (!this.isValidZipCode(data.zipCode)) {
            console.error('Invalid ZIP code format');
            return false;
        }
        
        return true;
    }

    async processPayment() {
        // Legacy method - keeping for backward compatibility
        // This is now replaced by processStripePayment()
        return this.processStripePayment();
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('fade-in');
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Send confirmation email (in real implementation)
            this.sendConfirmationEmail();
        }
    }

    sendConfirmationEmail() {
        // In a real implementation, trigger confirmation email
        console.log('Confirmation email would be sent to:', this.formData.email);
    }

    // Validation helper methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidZipCode(zipCode) {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        return zipRegex.test(zipCode);
    }

    isValidCardNumber(cardNumber) {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        return /^\d{13,19}$/.test(cleanNumber);
    }

    isValidExpiryDate(expiryDate) {
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!regex.test(expiryDate)) return false;
        
        const [month, year] = expiryDate.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const now = new Date();
        
        return expiry > now;
    }

    isValidCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }

    updateReviewContent() {
        // Update customer information review
        const customerReview = document.getElementById('customerReview');
        if (customerReview) {
            const firstName = document.getElementById('firstName')?.value || '';
            const lastName = document.getElementById('lastName')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const address1 = document.getElementById('address1')?.value || '';
            const city = document.getElementById('city')?.value || '';
            const state = document.getElementById('state')?.value || '';
            const zipCode = document.getElementById('zipCode')?.value || '';
            
            customerReview.innerHTML = `
                <p><strong>${firstName} ${lastName}</strong></p>
                <p>${email}</p>
                <p>${address1}</p>
                <p>${city}, ${state} ${zipCode}</p>
            `;
        }
        
        // Update payment method review
        const paymentReview = document.getElementById('paymentReview');
        if (paymentReview) {
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
            
            if (paymentMethod === 'card') {
                const cardNumber = document.getElementById('cardNumber')?.value || '';
                const maskedCard = '**** **** **** ' + cardNumber.slice(-4);
                paymentReview.innerHTML = `<p>Credit Card ending in ${cardNumber.slice(-4)}</p>`;
            } else if (paymentMethod === 'digital') {
                paymentReview.innerHTML = `<p>Digital Payment</p>`;
            }
        }
    }

    // Digital payment handlers
    async handleApplePay() {
        // Apple Pay implementation would go here
        console.log('Apple Pay selected');
        alert('Apple Pay integration would be implemented here');
    }

    async handleGooglePay() {
        // Google Pay implementation would go here
        console.log('Google Pay selected');
        alert('Google Pay integration would be implemented here');
    }

    async handlePayPal() {
        // PayPal implementation would go here
        console.log('PayPal selected');
        alert('PayPal integration would be implemented here');
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const checkout = new CheckoutManager();
    
    // Make checkout instance globally available for debugging
    window.checkout = checkout;
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', debounce(() => {
        checkout.initializeSummaryToggle();
    }, 250));
    
    // Handle back button
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.step) {
            checkout.goToStep(e.state.step);
        }
    });
    
    // Add initial state to history
    history.replaceState({ step: 1 }, 'Step 1', window.location.href);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CheckoutManager;
}
