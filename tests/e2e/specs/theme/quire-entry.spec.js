describe("Quire Entry Template", () => {
  beforeEach(() => {
    cy.visit("/catalogue/1/");
  });

  it("will go to the next image", () => {
    cy.get("#next-image").click();
    cy.get(".first-image").should("not.be.visible");
    cy.get(".current-image").should("be.visible");
  });

  it("will go to the previous image", () => {
    cy.get("#prev-image").click();
    cy.get(".first-image").should("not.be.visible");
    cy.get(".last-image").should("be.visible");
  });

  it("will download the image", () => {
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

  // Test Core Elements of Entry

  it("will have a main heading element", () => {
    cy.get(".quire-page__header__title").should("exist");
    cy.get(".quire-page__header__title")
      .invoke("text")
      .then(text => {
        expect(text.length > 0).to.eq(true);
      });
  });

  it("will have a tombstone element", () => {
    cy.get(".quire-entry__tombstone").should("exist");
    cy.get(".quire-entry__tombstone")
      .invoke("text")
      .then(text => {
        expect(text.length > 0).to.eq(true);
      });
  });

  it("will have a caption for the entry figure", () => {
    cy.get(
      ".current-image div:nth-child(3) span:nth-child(1) span:nth-child(1)"
    ).should("exist");
    cy.get(
      ".current-image div:nth-child(3) span:nth-child(1) span:nth-child(1)"
    )
      .invoke("text")
      .then(text => {
        expect(text.length > 0).to.eq(true);
      });
  });

  it("will have core wrapper class 'quire__primary' with an id", () => {
    cy.get(".quire__primary").then(element => {
      cy.get(element).should("exist");
      let id = element.attr("id");
      expect(id.length > 0).to.eq(true);
    });
  });

  it("will have a hero section with section element to display main heading", () => {
    cy.get(".quire-entry__header")
      .find(".quire-page__header__title")
      .then(element => {
        cy.get(element).should("exist");
        let id = element.attr("id");
        expect(id.length > 0).to.eq(true);
        cy.get(element)
          .invoke("text")
          .then(text => {
            expect(text.length > 0).to.eq(true);
          });
      });
  });
});
