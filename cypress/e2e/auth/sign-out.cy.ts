describe("Sign Out Feature", () => {
  beforeEach(() => {
    const user = Cypress.env("user");
    cy.signIn(user.email, user.password);
  });

  it("should display login and sign up buttons after successful sign out", () => {
    cy.get('button[aria-label="Open user button"]').click();
    cy.contains("button", "Sign out").click();
    cy.contains("button", "Login").should("be.visible");
    cy.contains("button", "Sign Up").should("be.visible");
  });
});
