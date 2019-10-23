describe("Quire Site Search", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should open search", () => {
    cy.get("#js-search").should("not.be.visible");
    cy.get(".search-button").click();
    cy.get("#js-search").should("be.visible");
  });

  it("should perform a search", () => {
    cy.get("#js-search").should("not.be.visible");
    cy.get(".search-button").click();
    cy.get("#js-search").should("be.visible");
    cy.get("input[name=search]").type("Walker Evans");
  });

  it("should click a search link", () => {
    cy.get("#js-search").should("not.be.visible");
    cy.get(".search-button").click();
    cy.get("#js-search").should("be.visible");
    cy.get("input[name=search]").type("Walker Evans");
    cy.get("li.quire-search__inner__list-item:nth-child(1) a:nth-child(1)")
      .should("exist")
      .click();
  });
});
