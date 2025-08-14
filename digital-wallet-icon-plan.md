# Plan: Digital Wallet Icon Standardization (v2)

This document outlines the plan to update the digital wallet icons on the `concierge/checkout.html` page to match the specific, emoji-based style used in the `welcome/checkout.html` page, as requested.

## To-Do List

- [ ] **1. Branch Creation**
    - Create a new Git branch named `feature/digital-wallet-icons` from the latest `main` branch.

- [ ] **2. HTML Updates**
    - **File:** `concierge/checkout.html`
    - **Action:** Replace the current digital wallet section with a new structure using `<button>` elements and specific emoji icons for each service.
    - **Target HTML Structure:**
      ```html
      <div class="digital-wallets">
          <div class="payment-option-group">
              <input type="radio" id="digitalWallets" name="paymentMethod" value="digital">
              <label for="digitalWallets">Digital Wallets</label>
          </div>
          <div class="wallet-buttons">
              <button class="wallet-button">
                  <span class="wallet-icon">🍎</span>
                  Apple Pay
              </button>
              <button class="wallet-button">
                  <span class="wallet-icon">🟢</span>
                  Google Pay
              </button>
              <button class="wallet-button">
                  <span class="wallet-icon">💙</span>
                  PayPal
              </button>
          </div>
      </div>
      ```

- [ ] **3. CSS Updates**
    - **File:** `concierge/checkout.css`
    - **Action:** Copy the relevant CSS rules for `.digital-wallets`, `.wallet-buttons`, and `.wallet-button` from `welcome/checkout.css` to ensure the new buttons are styled correctly.

- [ ] **4. Verification**
    - **Action:** Launch a local web server and open `concierge/checkout.html`.
    - **Check:** Confirm that the new digital wallet buttons with the specific emoji icons (Apple, Google, PayPal) are displayed correctly.

- [ ] **5. Documentation**
    - **File:** `CHANGELOG.md`
    - **Action:** Add a new entry under a "Changed" section detailing the standardization of the digital wallet icons to match the welcome page style.

- [ ] **6. Commits & Push**
    - **Action:**
        - Stage the modified files (`concierge/checkout.html`, `concierge/checkout.css`, `CHANGELOG.md`).
        - Commit the changes with a descriptive message (e.g., "feat: Standardize digital wallet icons to welcome page style").
        - Push the `feature/digital-wallet-icons` branch to the remote repository.
