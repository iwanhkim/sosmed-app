declare namespace Cypress {
  interface Chainable {
    signIn(email: string, password: string): Chainable<void>;
    signUpANewAccount(username: string): Chainable<void>;
    signOut(): Chainable<void>;
  }
}

Cypress.Commands.add("signIn", (email: string, password: string) => {
  cy.visit("/");
  cy.contains("button", "Login").click();
  cy.get("#identifier-field").type(email);
  cy.contains("button", "Continue").click();
  cy.get("#password-field").type(password);
  cy.contains("button", "Continue").click();
});

Cypress.Commands.add("signUpANewAccount", (username: string) => {
  cy.visit("/");
  cy.contains("button", "Sign Up").click();
  cy.get("#emailAddress-field").type(`${username}@mail.com`);
  cy.get("#password-field").type("mysup3rs3cr3tp4Ssw0rd");
  cy.contains("button", "Continue").click();
});

Cypress.Commands.add("signOut", () => {
  cy.get('button[aria-label="Open user button"]').click();
  cy.contains("button", "Sign out").click({ force: true });
});

Cypress.on("uncaught:exception", (err, runnable) => {
  if (
    err.message.includes("Text content does not match server-rendered HTML")
  ) {
    return false;
  }

  if (
    err.message.includes(
      "There was an error while hydrating this Suspense boundary. Switched to client rendering."
    )
  ) {
    return false;
  }
  return true;
});
