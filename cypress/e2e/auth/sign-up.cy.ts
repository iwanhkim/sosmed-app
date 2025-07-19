describe("Sign Up Feature", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Negative Cases", () => {
    it("should show validation messages when required fields are empty", () => {
      cy.contains("button", "Sign Up").click();
      cy.contains("button", "Continue").click();

      cy.get("#emailAddress-field").then(($input) => {
        expect(($input[0] as HTMLInputElement).checkValidity()).to.be.false;
        expect(($input[0] as HTMLInputElement).validationMessage).to.eq("Please fill out this field.");
      });

      cy.get("#emailAddress-field").type("validemailformat@gmail.com");
      cy.contains("button", "Continue").click();

      cy.get("#password-field").then(($input) => {
        expect(($input[0] as HTMLInputElement).checkValidity()).to.be.false;
        expect(($input[0] as HTMLInputElement).validationMessage).to.eq("Please fill out this field.");
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
  });

  describe("Positive Cases", () => {
    it("should successfully sign up with valid and unique credentials", () => {
      const uniqueEmail = `user_${Date.now()}@mail.com`;
      cy.contains("button", "Sign Up").click();
      cy.get("#emailAddress-field").type(uniqueEmail);
      cy.wait(1000);
      cy.get("#password-field").type("mysup3rs3cr3tp4Ssw0rd");
      cy.contains("button", "Continue").click();
      cy.get('button[aria-label="Open user button"]').click();
      cy.contains("button", "Sign out").should("be.visible");
    });
  });
});
