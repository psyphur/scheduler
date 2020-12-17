describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });

  it("should find Tuesday and click on it", () => {
    cy.visit("/");

    cy.contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");
  })
});