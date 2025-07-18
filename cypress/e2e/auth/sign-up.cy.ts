describe("Sign Up Feature", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Negative Cases", () => {
    it("should show validation messages when required fields are empty", () => {
      cy.contains("button", "Sign Up").click();
      cy.contains("button", "Continue").click();

      cy.get("#emailAddress-field").then(($input) => {
        expect($input[0].checkValidity()).to.be.false;
        expect($input[0].validationMessage).to.eq("Please fill out this field.");
      });

      cy.get("#emailAddress-field").type("validemailformat@gmail.com");
      cy.contains("button", "Continue").click();

      cy.get("#password-field").then(($input) => {
        expect($input[0].checkValidity()).to.be.false;
        expect($input[0].validationMessage).to.eq("Please fill out this field.");
      });
    });

    it("should display error when email is already registered", () => {
      cy.contains("button", "Sign Up").click();
      cy.get("#emailAddress-field").type("testin@gmail.com");
      cy.get("#password-field").type("mysup3rs3cr3tp4Ssw0rd");
      cy.contains("button", "Continue").click();
      cy.get("#error-emailAddress")
        .should("be.visible")
        .and("have.text", "That email address is taken. Please try another.");
    });

    it("should reject common breached passwords", () => {
      const uniqueEmail = `user_${Date.now()}@mail.com`;
      cy.contains("button", "Sign Up").click();
      cy.get("#emailAddress-field").type(uniqueEmail);
      cy.get("#password-field").type("12345678");
      cy.contains("button", "Continue").click();
      cy.get("#error-password")
        .should("be.visible")
        .and(
          "have.text",
          "This password has been found as part of a breach and can not be used, please try another password instead."
        );
    });

    it("should require minimum password length", () => {
      cy.contains("button", "Sign Up").click();
      cy.get("#emailAddress-field").type("validemailformat@gmail.com");
      cy.get("#password-field").type("1234567");
      cy.contains("button", "Continue").click();
      cy.get("#error-password").should("be.visible");
    });
  });

  describe("Positive Cases", () => {
    it("should successfully sign up with valid and unique credentials", () => {
      const uniqueEmail = `user_${Date.now()}@mail.com`;
      cy.contains("button", "Sign Up").click();
      cy.get("#emailAddress-field").type(uniqueEmail);
      cy.get("#password-field").type("mysup3rs3cr3tp4Ssw0rd");
      cy.contains("button", "Continue").click();
      cy.get('button[aria-label="Open user button"]', { timeout: 10000 }).click();
      cy.contains("button", "Sign out").should("be.visible");
    });
  });
});
