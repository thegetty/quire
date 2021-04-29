describe("Quire Contents Template", () => {
  beforeEach(() => {
    cy.visit("/contents/");
  });

  it("will have core wrapper class 'quire__primary' with an id", () => {
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

  it("will have a 'quire-contents-list' with a unordered list of anchors", () => {
    cy.get(".quire-contents-list")
      .find(".menu-list ul")
      .then(element => {
        cy.get(element).should("exist");
        cy.get(element)
          .children("li")
          .should("have.length", 10);
      });
  });

  it("will have an unordered list of anchors that have a status code of 200", () => {
    cy.get(".quire-contents-list ul li div")
      .find("a")
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
