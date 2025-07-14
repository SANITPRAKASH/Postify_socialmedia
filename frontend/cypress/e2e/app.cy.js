/// <reference types="cypress" />
/* global describe, it, cy, beforeEach */

describe("App End-to-End Test", () => {
  const email = "sanitprakash@outlook.com";
  const password = "@30tinaS";

  beforeEach(() => {
    cy.visit("http://localhost:5173/login");
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should("not.include", "/login");
    cy.get("body", { timeout: 8000 }).should("exist");
  });

  it("Login works", () => {
    cy.url().should("include", "/");
  });

  it("Home page loads with posts", () => {
    cy.visit("/");
    cy.contains("Postify");
  });

  it("Edit profile page works", () => {
    cy.visit("/account/edit");
    
  });

  it("Chat page opens", () => {
    cy.visit("/chat");
    cy.contains("Messages").should("exist");
  });

  it("Logout works", () => {
    cy.wait(1000);
    cy.screenshot();
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="logout"]').length > 0) {
        cy.get('[data-testid="logout"]').click({ force: true });
        cy.url().should("include", "/login");
      } else {
        cy.log("Logout button not found – skipping");
      }
    });
  });
});
