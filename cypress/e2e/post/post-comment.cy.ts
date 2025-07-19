describe("Post Feature - Comment Post", () => {
  context("Negative Cases", () => {
    it("should prevent unauthenticated users from commenting on a post", () => {
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
    it("should allow authenticated users to comment on another user's post", () => {
      const uniqueUsername = `user_${Date.now()}`;
      cy.signUpANewAccount(uniqueUsername);
      const postContent = `postContent_${Date.now()}`;
      cy.get('textarea[placeholder="What\'s on your mind?"]').type(postContent);
      cy.contains("button", "Post").click();
      cy.contains(postContent).should("be.visible");
      cy.signOut();
      cy.reload();

      const user = Cypress.env("user");
      cy.signIn(user.email, user.password);
      cy.wait(5000);
      cy.contains(postContent)
        .parents("div.space-y-4")
        .within(() => {
          cy.get("button:has(svg.lucide-message-circle)").click();
        });

      const comment = `postComment_${Date.now()}`;
      cy.get('textarea[placeholder="Write a comment..."]').type(comment);
      cy.contains("button", "Comment").click();
      cy.contains("button", "Posting...")
        .should("be.visible")
        .and("be.disabled");
      cy.get('div[role="status"][aria-live="polite"]').should(
        "contain.text",
        "Comment posted successfully"
      );
      cy.contains(comment).should("be.visible");
      cy.reload();
      cy.contains(postContent)
        .parents("div.space-y-4")
        .within(() => {
          cy.get("button:has(svg.lucide-message-circle)").click();
        });
      cy.contains(comment).should("be.visible");
    });

    it("should allow authenticated users to comment on their own post", () => {
      const user = Cypress.env("user");
      cy.signIn(user.email, user.password);

      const postContent = `postContent_${Date.now()}`;
      cy.get('textarea[placeholder="What\'s on your mind?"]').type(postContent);
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
      cy.contains("button", "Posting...")
        .should("be.visible")
        .and("be.disabled");
      cy.get('div[role="status"][aria-live="polite"]').should(
        "contain.text",
        "Comment posted successfully"
      );
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
