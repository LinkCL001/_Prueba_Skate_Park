describe("Prueba Skate Park", () => { // a. Smoke test.
    it("frontepage can be oppened", ()=>{
        cy.visit("http://localhost:3000");
        cy.contains("Iniciar Sesión")
    });
    it("Submit ingresar", () => {//b. Test a 1 input.
        cy.visit("http://localhost:3000/login")
        cy.contains("Iniciar Sesión").click();
    })
    it("Click test input", () => {//c. Test a 1 botón.
        cy.visit("http://localhost:3000/login")
        cy.get("input:first").type("who.fbi@fbi.com");
    })
})