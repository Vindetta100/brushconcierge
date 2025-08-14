// Checkout Page JavaScript
class CheckoutManager {
    constructor() {
        this.currentStep = 1;
        this.formData = {};
        this.tierData = {
            essentials: {
                name: 'The Essentials',
                price: 39.00,
                priceId: 'price_1RsXfJ08jBtUv1BcKxMyi5hR', // REPLACE WITH YOUR STRIPE PRICE ID
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
                priceId: 'price_1RsXh608jBtUv1BcDXc1cCT7', // REPLACE WITH YOUR STRIPE PRICE ID
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
                priceId: 'price_1RsXjU08jBtUv1Bca7ZYJT31', // REPLACE WITH YOUR STRIPE PRICE ID
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
        document.getElementById('backToInfo')?.addEventListener('click', () => {
            this.clearSensitiveData();
            this.goToStep(1);
        });
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
        
        // Security: Clear sensitive data on page navigation
        window.addEventListener('beforeunload', () => this.clearSensitiveData());
        window.addEventListener('blur', () => this.clearSensitiveData());
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
        
        const bothTermsAccepted = termsChecked && subscriptionChecked;
        
        if (completeOrderBtn) {
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
        
        return bothTermsAccepted;
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
        const cleaned = cardNumber.replace(/\s/g, '');
        return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
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

    // Form data management
    saveFormData() {
        const formData = new FormData(document.getElementById('checkoutForm'));
        const data = Object.fromEntries(formData.entries());
        
        // Remove sensitive payment information for security
        const sensitiveFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        sensitiveFields.forEach(field => {
            delete data[field];
        });
        
        localStorage.setItem('checkoutFormData', JSON.stringify(data));
    }

    populateFormFromStorage() {
        const savedData = localStorage.getItem('checkoutFormData');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.entries(data).forEach(([key, value]) => {
                const field = document.getElementById(key);
                if (field) {
                    field.value = value;
                }
            });
        }
    }

    clearSensitiveData() {
        // Clear credit card fields for security
        const sensitiveFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        sensitiveFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = '';
                this.clearFieldError(fieldId);
            }
        });
    }

    // Real-time validation setup
    setupRealTimeValidation() {
        const fields = ['firstName', 'lastName', 'email', 'address1', 'city', 'zipCode'];
        
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => {
                    if (field.value.trim()) {
                        this.clearFieldError(fieldName);
                    }
                });
            }
        });
    }

    bindFormValidation() {
        // Add real-time validation for all form fields
        const form = document.getElementById('checkoutForm');
        if (form) {
            form.addEventListener('input', (e) => {
                if (e.target.classList.contains('error')) {
                    this.clearFieldError(e.target.id);
                }
            });
        }
    }

    bindCardFormatting() {
        const cardNumberField = document.getElementById('cardNumber');
        const expiryField = document.getElementById('expiryDate');
        const cvvField = document.getElementById('cvv');

        if (cardNumberField) {
            cardNumberField.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '');
                let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
                if (formattedValue.length > 19) {
                    formattedValue = formattedValue.substring(0, 19);
                }
                e.target.value = formattedValue;
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
                e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
            });
        }
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
            const cardNumber = document.getElementById('cardNumber')?.value || '';
            const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
            
            paymentReview.innerHTML = `
                <p><strong>Credit Card</strong></p>
                <p>•••• •••• •••• ${lastFour}</p>
            `;
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateTermsAcceptance()) {
            alert('Please accept the terms and conditions to continue.');
            return;
        }

        // Show loading state
        const submitBtn = document.getElementById('completeOrder');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';
        }

        // Prepare data for Stripe
        const tier = this.tierData[this.selectedTier];
        const formData = new FormData(e.target);
        const customerData = Object.fromEntries(formData.entries());

        // Create Stripe checkout session
        this.createStripeSession(tier, customerData);
    }

    async createStripeSession(tier, customerData) {
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: tier.priceId,
                    customerData: customerData,
                    tier: this.selectedTier
                })
            });

            const session = await response.json();

            if (session.url) {
                // Save form data before redirect
                this.saveFormData();
                
                // Redirect to Stripe Checkout
                window.location.href = session.url;
            } else {
                throw new Error('Failed to create checkout session');
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            alert('There was an error processing your payment. Please try again.');
            
            // Reset submit button
            const submitBtn = document.getElementById('completeOrder');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Complete Order';
            }
        }
    }

    showSuccessModal() {
        // Create and show success modal
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="success-icon">✓</div>
                <h2>Welcome to Brush Concierge!</h2>
                <p>Your subscription has been successfully activated.</p>
                <p>You'll receive a welcome email with your shipping kit within the next few minutes.</p>
                <button onclick="window.location.href='index.html'" class="btn btn--primary">
                    Return to Home
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-redirect after 10 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 10000);
    }
}

// Initialize checkout manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutManager();
});
