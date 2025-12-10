// cypress/support/uam-commands.js

Cypress.Commands.add('navigateToProfile', () => {
  // Klik avatar/profile icon di navbar
  cy.get('button[aria-label="Open settings"]', {timeout: 15000})
    .should('be.visible')
    .click({force: true});
  
  cy.wait(1000);
  
  // Klik menu "Profile" dari dropdown (ensure it's visible)
  cy.contains('a', 'Profile', {timeout: 10000})
    .should('exist')
    .click({force: true});
  
  cy.wait(2000);
  
  // Verify navigation succeeded
  cy.url({timeout: 10000}).should('include', '/profile');
});

Cypress.Commands.add('fillAddressForm', (data) => {
  if (data.type !== undefined) {
    cy.get('input[name="type"]').clear();
    if (data.type) cy.get('input[name="type"]').type(data.type, {force: true});
  }
  
  if (data.street !== undefined) {
    cy.get('input[name="street"]').clear();
    if (data.street) cy.get('input[name="street"]').type(data.street, {force: true});
  }
  
  if (data.postalCode !== undefined) {
    cy.get('input[name="postalCode"]').clear();
    if (data.postalCode) cy.get('input[name="postalCode"]').type(data.postalCode, {force: true});
  }
  
  if (data.country !== undefined) {
    cy.get('input[name="country"]').clear();
    if (data.country) cy.get('input[name="country"]').type(data.country, {force: true});
  }
  
  if (data.phoneNumber !== undefined) {
    cy.get('input[name="phoneNumber"]').clear();
    if (data.phoneNumber) cy.get('input[name="phoneNumber"]').type(data.phoneNumber, {force: true});
  }
  
  if (data.state !== undefined) {
    cy.get('input[name="state"]').clear();
    if (data.state) cy.get('input[name="state"]').type(data.state, {force: true});
  }
  
  if (data.city !== undefined) {
    cy.get('input[name="city"]').clear();
    if (data.city) cy.get('input[name="city"]').type(data.city, {force: true});
  }
});

Cypress.Commands.add('addToWishlistByIndex', (index = 0) => {
  cy.get('[data-testid="FavoriteBorderIcon"]')
    .eq(index)
    .closest('span')
    .scrollIntoView()
    .should('exist')
    .click({force: true});
  
  cy.wait(1000);
});

Cypress.Commands.add('writeProductReview', (comment, rating) => {
  // Klik "Write a review" button
  cy.contains('button', /Write a review/i, {timeout: 10000})
    .should('be.visible')
    .click({force: true});
  
  cy.wait(1000);
  
  // Fill comment (optional)
  if (comment) {
    cy.get('textarea[name="comment"]')
      .clear()
      .type(comment, {force: true});
  } else {
    cy.get('textarea[name="comment"]').clear();
  }
  
  // Select rating (1-5)
  if (rating) {
    cy.get(`.MuiRating-root input[type="radio"][value="${rating}"]`)
      .check({force: true});
  }
  
  // Submit review
  cy.contains('button', /add review/i).click({force: true});
  cy.wait(2000);
});