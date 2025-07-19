describe("Post Feature - Like Post", () => {
  context("Negative Cases", () => {
    it("should prevent unauthenticated users from liking a post", () => {
      cy.visit("/");

      cy.get("div.space-y-6")
        .first()
        .within(() => {
          cy.get("button:has(svg.lucide-heart)").first().click();
        });

      cy.contains("Welcome back! Please sign in to continue").should(
        "be.visible"
      );
    });
  });

  context("Positive Cases", () => {
    it("should allow authenticated user to like another user's post", () => {
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
          cy.get("button:has(svg.lucide-heart)")
            .find("span")
            .invoke("text")
            .then((textBefore) => {
              const countBefore = parseInt(textBefore.trim()) || 0;

              cy.get("button:has(svg.lucide-heart)").click();

              cy.wait(200);

              cy.get("button:has(svg.lucide-heart)")
                .find("span")
                .invoke("text")
                .then((textAfter) => {
                  const countAfter = parseInt(textAfter.trim()) || 0;
                  expect(countAfter).to.eq(countBefore + 1);
                });
            });
        });
    });

    it("should allow authenticated user to like their own post", () => {
      const user = Cypress.env("user");
      cy.signIn(user.email, user.password);

      const postContent = `postContent_${Date.now()}`;
      cy.get('textarea[placeholder="What\'s on your mind?"]').type(postContent);
      cy.contains("button", "Post").click();
      cy.contains(postContent).should("be.visible");
      cy.contains(postContent)
        .parents("div.space-y-4")
        .within(() => {
          cy.get("button:has(svg.lucide-heart)")
            .find("span")
            .invoke("text")
            .then((textBefore) => {
              const countBefore = parseInt(textBefore.trim()) || 0;

              cy.get("button:has(svg.lucide-heart)").click();

              cy.wait(200);

              cy.get("button:has(svg.lucide-heart)")
                .find("span")
                .invoke("text")
                .then((textAfter) => {
                  const countAfter = parseInt(textAfter.trim()) || 0;
                  expect(countAfter).to.eq(countBefore + 1);
                });
            });
        });
    });
  });
});
