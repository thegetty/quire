describe("Quire Site Search Core Functions", () => {
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

  it("search.json data and element should exist", () => {
    cy.get("#js-search").should("exist");
    cy.get("#js-search").then(element => {
      cy.get(element).should("exist");
      let dataSearchindex = element.attr("data-search-index");
      expect(dataSearchindex.length > 0).to.eq(true);
    });
  });

  it("will check that search.json actually exists", () => {
    cy.get("#js-search").should("exist");
    cy.get("#js-search").then(element => {
      let href = element.attr("data-search-index");
      let url = new URL(href, window.location.origin).href;
      cy.request(url).then(response => {
        expect(response.status).to.eq(200);
      });
    });
  });
});
