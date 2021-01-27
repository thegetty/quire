describe("Quire Modal Image viewer Core Functions", () => {
  beforeEach(() => {
    cy.visit("/essay/");
  });

  // click 1st image and open modal viewer
  it("open modal image viewer", () => {
    cy.get(".mfp-content").should("not.be.visible");
    cy.get(
      "#content div div.content figure.quire-figure.is-pulled-center"
    ).click();
    cy.get(".mfp-content").should("be.visible");
  });

  // click 1st image and open modal viewer and go to next image
  it("open modal image viewer and go to next image", async () => {
    cy.get(".mfp-content").should("not.be.visible");
    cy.get(
      "#content div div.content figure.quire-figure.is-pulled-center"
    ).click();
    cy.get(".mfp-content").should("be.visible");
    cy.get(".mfp-arrow-right").click();
    cy.get(".quire-counter-container span").then(element => {
      let title = element.attr("title");
      expect(title.indexOf("2 of 8") !== -1).to.eq(true);
    });
  });

  // click 1st image and open modal viewer and got to the previous image
  it("open modal image viewer and go to previous image", async () => {
    cy.get(".mfp-content").should("not.be.visible");
    cy.get(
      "#content div div.content figure.quire-figure.is-pulled-center"
    ).click();
    cy.get(".mfp-content").should("be.visible");
    cy.get(".mfp-arrow-left").click();
    cy.get(".quire-counter-container span").then(element => {
      let title = element.attr("title");
      expect(title.indexOf("8 of 8") !== -1).to.eq(true);
    });
  });

  /**
   *
   * This mostly works. However in some browsers for
   * cypress, it will warn with "Failed to execute
   * 'requestFullscreen' on 'Element': API can only be initiated by
   * a user gesture." This test passes becasue it does not
   * detect that fullscreen API has been initialized, but
   * it looks that the "fullscreen" class has been added to
   * style the button.
   * Issues on Github => https://github.com/cypress-io/cypress/issues/311,
   * https://github.com/cypress-io/cypress/issues/1213
   *
   */
  // click 1st image and open modal viewer and click full screen button
  it("open modal image viewer and click full screen button", async () => {
    cy.get(".mfp-content").should("not.be.visible");
    cy.get(
      "#content div div.content figure.quire-figure.is-pulled-center"
    ).click();
    cy.get(".mfp-content").should("be.visible");
    cy.get("#toggleFullscreen").click();
    cy.get("#toggleFullscreen").then(element => {
      let c = element.attr("class");
      expect(c.indexOf("fullscreen") !== -1).to.eq(true);
    });
  });
});
