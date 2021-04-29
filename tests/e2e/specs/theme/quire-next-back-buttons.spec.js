describe("Quire < Prev Next > Buttons", () => {
  beforeEach(() => {
    cy.visit("/contents/");
  });

  it("will have a 'quire-contents-buttons' with 2 buttons", () => {
    cy.get(".quire-contents-buttons ul")
      .find(".quire-nav-button a")
      .then(anchor => {
        cy.get(anchor).should("exist");
        cy.get(anchor).should("have.length", 2);
      });
  });

  it("Both buttons will link to pages that have a status code of 200", () => {
    cy.get(".quire-contents-buttons ul")
      .find(".quire-nav-button a")
      .then(anchor => {
        cy.get(anchor).should("exist");
        let href = anchor.attr("href");
        let url = new URL(href, window.location.origin).href;
        cy.request(url).then(response => {
          expect(response.status).to.eq(200);
        });
      });
  });
});
