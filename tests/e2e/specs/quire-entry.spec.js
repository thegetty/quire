describe("Quire Entry", () => {
  beforeEach(function() {
    cy.visit("/catalogue/1/");
  });

  // test buttons for entry viewer

  it("should go to the next image", () => {
    cy.get("#next-image").click();
    cy.get(".first-image").should("not.be.visible");
    cy.get(".current-image").should("be.visible");
  });

  it("should go to the previous image", () => {});

  it("should download the image", () => {});

  it("should fullscreen the image", () => {});
});
