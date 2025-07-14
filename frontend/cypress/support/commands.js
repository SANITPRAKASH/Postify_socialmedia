/// <reference types="cypress" />
Cypress.Commands.add('login', () => {
  cy.visit('http://localhost:5173/login');
  cy.get('input[type="email"]').type('sanitprakash@outlook.com');
  cy.get('input[type="password"]').type('@30tinaS');
  cy.get('button[type="submit"]').click();
});
