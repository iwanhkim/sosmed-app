describe("Sign In Feature", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Negative Cases", () => {
    it("should show validation message when email is empty", () => {
      cy.contains("button", "Sign In").click();
      cy.contains("button", "Continue").click();
      cy.get("#identifier-field").then(($input) => {
        expect(($input[0] as HTMLInputElement).checkValidity()).to.be.false;
        expect(($input[0] as HTMLInputElement).validationMessage).to.eq("Please fill out this field.");
      });
    });

    it("should show error when using unregistered email", () => {
      cy.contains("button", "Sign In").click();
      cy.get("#identifier-field").type("randomemail123sdkjfsdfjkal@gmail.com");
      cy.contains("button", "Continue").click();
      cy.get("#error-identifier")
        .should("be.visible")
        .and("have.text", "Couldn't find your account.");
    });

    it("should show error when password is not provided", () => {
      cy.contains("button", "Sign In").click();
      cy.get("#identifier-field").type("testing@gmail.com");
      cy.contains("button", "Continue").click();
      cy.contains("button", "Continue").click();
      cy.get("#error-password")
        .should("be.visible")
        .and("have.text", "Enter password.");
    });

    it("should show error when password is incorrect", () => {
      cy.contains("button", "Sign In").click();
      cy.get("#identifier-field").type("testing@gmail.com");
      cy.contains("button", "Continue").click();
      cy.get("#password-field").type("thisIsAWrongPassword");
      cy.contains("button", "Continue").click();
      cy.get("#error-password")
        .should("be.visible")
        .and(
          "have.text",
          "Password is incorrect. Try again, or use another method."
        );
    });
  });

  describe("Positive Cases", () => {
    it("should sign in successfully with valid credentials", () => {
      cy.contains("button", "Sign In").click();
      cy.get("#identifier-field").type("testing@gmail.com");
      cy.contains("button", "Continue").click();
      cy.get("#password-field").type("testinggmailcom");
      cy.contains("button", "Continue").click();
      cy.get('button[aria-label="Open user button"]', { timeout: 10000 }).click();
      cy.contains("button", "Sign out").should("be.visible");
    });
  });
});