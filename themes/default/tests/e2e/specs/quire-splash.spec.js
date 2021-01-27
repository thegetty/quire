describe("Quire Splash Page Tempalte", () => {
  beforeEach(() => {
    cy.visit("/intro/");
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
});
