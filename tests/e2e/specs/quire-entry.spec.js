describe("Quire Entry", () => {
  beforeEach(function() {
    cy.visit("/catalogue/1/");
  });

  // test buttons for entry viewer

  it("should go to the next image", () => {
    cy.get("#next-image").click();
    cy.get(".first-image").should("not.be.visible");
    cy.get(".current-image").should("be.visible");
  });

  it("should go to the previous image", () => {
    cy.get("#prev-image").click();
    cy.get(".first-image").should("not.be.visible");
    cy.get(".last-image").should("be.visible");
  });

  it("should download the image", () => {
    cy.get(".quire-image-control--download").then(anchor => {
      let href = anchor.attr("href");
      let url = new URL(href, window.location.origin).href;
      cy.request(url).then(response => {
        expect(response.status).to.eq(200);
      });
    });
  });

  /**
   *
   * This mostly works. However in some browsers for
   * cypress, It will error with "Failed to execute
   * 'requestFullscreen' on 'Element': API can only be initiated by
   * a user gesture." This test passes becasue it does not
   * detect that fullscreen API has been initialized, but
   * it looks that the "fullscreen" class has been added to
   * style the button.
   * Issues on Github => https://github.com/cypress-io/cypress/issues/311,
   * https://github.com/cypress-io/cypress/issues/1213
   *
   */
  it("should fullscreen the image", () => {
    cy.get("#toggleFullscreen").click();
    cy.get("#toggleFullscreen").then(element => {
      let c = element.attr("class");
      expect(c.indexOf("fullscreen") !== -1).to.eq(true);
    });
  });
});
