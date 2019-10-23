describe("Quire Essay Template", () => {
  beforeEach(function() {
    cy.visit("/essay/");
  });

  // Test Buttons for Modal Image Viewer
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

  // Test Core Elements of Essay

  it("figure will have an id with deepzoom or map or iiif", () => {
    cy.get(".q-figure__wrapper")
      .find("figure.quire-figure")
      .then(element => {
        cy.get(element).should("exist");
        let id = element.attr("id");
        expect(
          id.indexOf("deepzoom") !== -1 ||
            id.indexOf("map") !== -1 ||
            id.indexOf("iiif") !== -1
        ).to.eq(true);
      });
  });

  it("figure will have caption element with text", () => {
    cy.get(".q-figure__wrapper")
      .find(".quire-figure__caption")
      .then(element => {
        cy.get(element).should("exist");
        cy.get(element)
          .invoke("text")
          .then(text => {
            expect(text.length > 0).to.eq(true);
          });
      });
  });

  it("figure will have popup element with data-type of 'inline'", () => {
    cy.get(".q-figure__wrapper")
      .find(".popup")
      .then(element => {
        cy.get(element).should("exist");
        let dataType = element.attr("data-type");
        expect(dataType.indexOf("inline") !== -1).to.eq(true);
      });
  });

  it("figure will have image element with class of 'quire-figure__image' that has a source attribute", () => {
    cy.get(".q-figure__wrapper")
      .find(".quire-figure__image")
      .then(element => {
        cy.get(element).should("exist");
        let src = element.attr("src");
        expect(src.length > 0).to.eq(true);
      });
  });

  it("figure group will have a child of 'quire-figure--group__row'", () => {
    cy.get("figure.quire-figure--group")
      .find(".quire-figure--group__row")
      .then(element => {
        cy.get(element).should("exist");
      });
  });

  it("'quire-figure--group__row' will have a child of 'quire-figure--group__item' and 2 groups of them for class 'quire-grid--2'", () => {
    cy.get(".quire-figure--group__row")
      .find(".quire-grid--2.quire-figure--group__item")
      .then(element => {
        cy.get(element).should("exist");
        cy.get(element).should("have.length", 4);
      });
  });

  it("will have core wrapper class 'quire__primary' and id of 'essay'", () => {
    cy.get(".quire__primary").then(element => {
      cy.get(element).should("exist");
      let id = element.attr("id");
      expect(id.indexOf("essay") !== -1).to.eq(true);
    });
  });

  it("will have a hero section with section element to display main heading", () => {
    cy.get(".quire-page__header")
      .find(".quire-page__header__title")
      .then(element => {
        cy.get(element).should("exist");
        cy.get(element)
          .invoke("text")
          .then(text => {
            expect(text.length > 0).to.eq(true);
          });
      });
  });

  it("will have a hero section with section element to display contributor or author info", () => {
    cy.get(".quire-page__header")
      .find(".quire-page__header__contributor")
      .then(element => {
        cy.get(element).should("exist");
        cy.get(element)
          .invoke("text")
          .then(text => {
            expect(text.length > 0).to.eq(true);
          });
      });
  });
});
