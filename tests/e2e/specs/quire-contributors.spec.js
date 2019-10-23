describe("Quire Contributors Core Elements", () => {
  beforeEach(() => {
    cy.visit("/contributors/");
  });

  it("quire-contributors-list will have quire-contributor with an id", () => {
    cy.get(".quire-contributors-list").should("exist");
    cy.get(".quire-contributors-list")
      .find(".quire-contributor")
      .then(element => {
        cy.get(element).should("exist");
        let id = element.attr("id");
        expect(id.length > 0).to.eq(true);
      });
  });

  it("quire-contributors-list will have quire-contributor__name", () => {
    cy.get(".quire-contributors-list").should("exist");
    cy.get(".quire-contributors-list")
      .find(".quire-contributor__name")
      .then(element => {
        cy.get(element).should("exist");
        cy.get(element)
          .invoke("text")
          .then(text => {
            expect(text.length > 0).to.eq(true);
          });
      });
  });

  it("quire-contributor will have quire-contributor__url with a href", () => {
    cy.get(".quire-contributor").should("exist");
    cy.get(".quire-contributor")
      .find(".quire-contributor__url")
      .then(element => {
        cy.get(element).should("exist");
        let href = element.attr("href");
        expect(href.length > 0).to.eq(true);
      });
  });

  it("quire-contributors-details will have quire-contributor__pic", () => {
    cy.get(".quire-contributor__details").should("exist");
    cy.get(".quire-contributor__details")
      .find(".quire-contributor__pic")
      .then(element => {
        cy.get(element).should("exist");
        let src = element.attr("src");
        expect(src.length > 0).to.eq(true);
      });
  });

  it("quire-contributors-details will have quire-contributor__bio", () => {
    cy.get(".quire-contributor__details").should("exist");
    cy.get(".quire-contributor__details")
      .find(".quire-contributor__bio")
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
