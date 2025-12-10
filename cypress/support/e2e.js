// Import commands.js
import './auth-commands';
import './shopping-commands'; 
import './uam-commands';


// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});