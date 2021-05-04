describe("Quire Essay Template", () => {
  beforeEach(() => {
    cy.visit("/essay/");
  });

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

  it("will have core wrapper class 'quire__primary'", () => {
    cy.get(".quire__primary").then(element => {
      cy.get(element).should("exist");
      let id = element.attr("id");
      expect(id.length > 0).to.eq(true);
    });
  });

  it("will have a hero section with section element to display main heading", () => {
    cy.get(".quire-page__header")
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
