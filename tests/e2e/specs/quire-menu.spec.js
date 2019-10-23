describe("Quire Site Menu Core Elements and Functions", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("toggles the side menu", () => {
    cy.get("#site-menu").should("not.be.visible");
    cy.get("#quire-controls-menu-button").click();
    cy.get("#site-menu").should("be.visible");
  });

  it("should have a title", () => {
    cy.get(".quire-menu__header__title").should("exist");
  });

  it("should have nav link list", () => {
    cy.get("#site-menu").should("not.be.visible");
    cy.get("#quire-controls-menu-button").click();
    cy.get("#site-menu").should("be.visible");
    cy.get("#nav ul li a").should("exist");
    cy.get("#nav > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1)")
      .should("exist")
      .click();
  });

  it("should have other formats", () => {
    cy.get("div.quire-menu__formats:nth-child(3) h6").should("exist");
    cy.get("div.quire-menu__formats:nth-child(3) ul li").should(
      "have.length",
      3
    );
  });

  it("should have cite this page", () => {
    cy.get("div.quire-menu__formats:nth-child(4) h6").should("exist");
    cy.get("div.quire-menu__formats:nth-child(4) div").should("have.length", 2);
  });
});
