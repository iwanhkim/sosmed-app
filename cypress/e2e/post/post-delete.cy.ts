describe("Post Feature - Delete Post", () => {
  context("Negative Cases", () => {
    it("should prevent deleting post owned by another user", () => {
      const postContent = `postContent_${Date.now()}`;
      const uniqueUsername = `user_${Date.now()}`;
      cy.signUpANewAccount(uniqueUsername);
      cy.get('textarea[placeholder="What\'s on your mind?"]', {
        timeout: 10000,
      }).type(postContent);
      cy.contains("button", "Post").click();
      cy.contains(postContent).should("be.visible");
      cy.signOut();
      cy.reload();

      const user = Cypress.env("user");
      cy.signIn(user.email, user.password);
      cy.contains(postContent)
        .parents("div.space-y-4")
        .within(() => {
          cy.get("button:has(svg.lucide-trash2)").should("not.exist");
        });
    });
  });

  context("Positive Cases", () => {
    it("should create a post and persist after reload", () => {
      const user = Cypress.env("user");
      cy.signIn(user.email, user.password);

      const postContent = `postContent_${Date.now()}`;
      cy.get('textarea[placeholder="What\'s on your mind?"]').type(postContent);
      cy.contains("button", "Post").click();
      cy.contains(postContent).should("be.visible");
      cy.reload();
      cy.contains(postContent)
        .parents("div.space-y-4")
        .within(() => {
          cy.get("button:has(svg.lucide-trash2)").click();
        });
      cy.contains("button", "Delete").click();
      cy.get('div[role="status"][aria-live="polite"]').should(
        "contain.text",
        "Post deleted successfully"
      );
      cy.contains(postContent).should("not.exist");
    });
  });
});
