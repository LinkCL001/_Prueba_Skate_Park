describe("Prueba Skate Park", () => {
    it("frontepage can be oppened", ()=>{
        cy.visit("http://localhost:3000");
        cy.contains("Ingresar")
    });
    it("Submit ingrsar", () => {
        cy.visit("http://localhost:3000")
        cy.contains("Ingresar").click();
    })
})