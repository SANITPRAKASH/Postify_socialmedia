/* global describe, it, cy, beforeEach */

/// <reference types="cypress" />

describe('App End-to-End Test', () => {
  const email = 'sanitprakash@outlook.com';
  const password = '@30tinaS';

  beforeEach(() => {
    // Use the custom command from commands.js
    cy.login();
  });

  it('Login works', () => {
    cy.visit('http://localhost:5173/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');
  });

  it('Home page loads with posts', () => {
    cy.visit('http://localhost:5173');
    cy.contains('Postify');
    // Add more selectors based on your post UI
  });

  it('Profile page loads', () => {
    cy.visit('http://localhost:5173/profile/6865558870f2c29eb4125057'); // 👈 Make sure this ID exists
    
  });

  it('Edit profile page works', () => {
    cy.visit('http://localhost:5173/account/edit');
    cy.get('form').should('exist');
  });

  it('Chat page opens', () => {
    cy.visit('http://localhost:5173/chat');
   
  });

  it('Logout works', () => {
    cy.wait(1000); // let the UI settle
cy.screenshot(); // take a screenshot so you can see what’s rendered
cy.get('body').then(($body) => {
  if ($body.find('[data-testid="logout"]').length) {
    cy.get('[data-testid="logout"]').click({ force: true });
  } else {
    throw new Error("Logout button not found — make sure you're logged in");
  }
});

  });
});
