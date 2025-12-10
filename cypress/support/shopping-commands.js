// cypress/support/commands.js

Cypress.Commands.add('loginUser', () => {
  // Ambil credentials dari cypress.config.js env
  const email = Cypress.env('testEmail');
  const password = Cypress.env('testPassword');
  
  cy.session('user-session', () => {
    cy.visit('/login');
    cy.url({ timeout: 10000 }).should('include', '/login');
    
    cy.get('input[name="email"], input[type="email"]', { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type(email);
    
    cy.get('input[name="password"], input[type="password"]')
      .should('be.visible')
      .clear()
      .type(password);
    
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 20000 }).should('not.include', '/login');
    cy.wait(1000);
  });
  
  cy.visit('/');
  cy.get('.MuiPaper-root', { timeout: 30000 }).should('exist').and('be.visible');
  cy.wait(1000);
});

Cypress.Commands.add('addToCartByIndex', (index = 0) => {
  cy.contains(/Add To Cart/i)
    .eq(index)
    .closest('button')
    .scrollIntoView()
    .should('exist')
    .click({ force: true });

  // Naikkan timeout toast
  cy.contains(/added to cart/i, { timeout: 20000 }).should('be.visible');
});

Cypress.Commands.add('openFilterSidebar', () => {
  cy.get('svg[data-testid="TuneIcon"]')
    .closest('button')
    .should('exist')
    .click({ force: true });
});

Cypress.Commands.add('fillShippingForm', (data) => {
  if (data.type) cy.get('input[name="type"]').clear().type(data.type, {force: true});
  if (data.street) cy.get('input[name="street"]').clear().type(data.street, {force: true});
  if (data.country) cy.get('input[name="country"]').clear().type(data.country, {force: true});
  if (data.phoneNumber) cy.get('input[name="phoneNumber"]').clear().type(data.phoneNumber, {force: true});
  if (data.city) cy.get('input[name="city"]').clear().type(data.city, {force: true});
  if (data.state) cy.get('input[name="state"]').clear().type(data.state, {force: true});
  if (data.postalCode) cy.get('input[name="postalCode"]').clear().type(data.postalCode, {force: true});
});


