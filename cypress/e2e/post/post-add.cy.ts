describe("Post Feature - Add Post", () => {
  beforeEach(() => {
    const user = Cypress.env("user");
    cy.signIn(user.email, user.password);
  });

  context("Negative Cases", () => {
    it("should not allow posting when textarea (content) is empty", () => {
      cy.contains("button", "Post").should("be.disabled");
    });

    it("should disable the Post button if text is typed and then cleared", () => {
      cy.get('textarea[placeholder="What\'s on your mind?"]')
        .type("temp")
        .clear();
      cy.contains("button", "Post").should("be.disabled");
    });

    it("should reject unsupported file types on upload", () => {
      cy.contains("button", "Photo").click();
      cy.get('input[type="file"]').selectFile("cypress/fixtures/test-pdf.pdf", {
        force: true,
      });
      cy.get('img[alt="Upload"]').should("not.exist");
    });
  });

  context("Positive Cases", () => {
    it("should create a post and persist after reload", () => {
      const postContent = `postContent_${Date.now()}`;
      cy.get('textarea[placeholder="What\'s on your mind?"]').type(postContent);
      cy.contains("button", "Post").click();
      cy.get('div[role="status"][aria-live="polite"]').should(
        "contain.text",
        "Post created successfully"
      );
      cy.contains(postContent).should("be.visible");
      cy.reload();
      cy.contains(postContent).should("be.visible");
    });

    it("should create a post with image and persist after reload", () => {
      const postContent = `postContent_${Date.now()}`;

      cy.get('textarea[placeholder="What\'s on your mind?"]').type(postContent);
      cy.contains("button", "Photo").click();
      cy.get('input[type="file"]').selectFile(
        "cypress/fixtures/test-image.png",
        {
          force: true,
        }
      );
      cy.contains("button", "Upload 1 file").click();
      cy.get('img[alt="Upload"]').should("be.visible");
      cy.contains("button", "Post").click();
      cy.get('div[role="status"][aria-live="polite"]').should(
        "contain.text",
        "Post created successfully"
      );
      cy.contains(postContent).should("be.visible");
      cy.contains(postContent)
        .parents("div.space-y-4")
        .within(() => {
          cy.get('img[src*="utfs.io"]').should(
            "be.visible"
          );
        });

      cy.reload();

      cy.contains(postContent).should("be.visible");
      cy.contains(postContent)
        .parents("div.space-y-4")
        .within(() => {
          cy.get('img[src*="utfs.io"]').should(
            "be.visible"
          );
        });
    });
  });
});
