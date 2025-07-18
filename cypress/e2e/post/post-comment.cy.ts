describe("Post Feature - Comment Post", () => {
  context("Negative Cases", () => {
    it("should prevent unauthenticated users from liking a post", () => {
      cy.visit("/");
      cy.get("div.space-y-6")
        .first()
        .within(() => {
          cy.get("button:has(svg.lucide-message-circle)").first().click();
        });
      cy.contains("Sign in to comment").should("be.visible");
    });
  });

  context("Positive Cases", () => {
    it("should allow authenticated user to like another user's post", () => {
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
          cy.get("button:has(svg.lucide-message-circle)").click();
        });

      const comment = `postComment_${Date.now()}`;
      cy.get('textarea[placeholder="Write a comment..."]').type(comment);
      cy.contains("button", "Comment").click();
      cy.contains(comment).should("be.visible");
      cy.reload();
      cy.contains(postContent)
        .parents("div.space-y-4")
        .within(() => {
          cy.get("button:has(svg.lucide-message-circle)").click();
        });
      cy.contains(comment).should("be.visible");
    });

    it("should allow authenticated user to like their own post", () => {
      const user = Cypress.env("user");
      cy.signIn(user.email, user.password);

      const postContent = `postContent_${Date.now()}`;
      cy.get('textarea[placeholder="What\'s on your mind?"]', {
        timeout: 10000,
      }).type(postContent);
      cy.contains("button", "Post").click();
      cy.contains(postContent).should("be.visible");
      cy.contains(postContent)
        .parents("div.space-y-4")
        .within(() => {
          cy.get("button:has(svg.lucide-message-circle)").click();
        });

      const comment = `postComment_${Date.now()}`;
      cy.get('textarea[placeholder="Write a comment..."]').type(comment);
      cy.contains("button", "Comment").click();
      cy.contains(comment).should("be.visible");
      cy.reload();
      cy.contains(postContent)
        .parents("div.space-y-4")
        .within(() => {
          cy.get("button:has(svg.lucide-message-circle)").click();
        });
      cy.contains(comment).should("be.visible");
    });
  });
});
