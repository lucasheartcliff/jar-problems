describe('Test Cases', () => {
  it('should find solution', () => {

    cy.visit('http://localhost:3000/');

    cy.get('#targetSize').click();
    cy.get('#targetSize').type('6');
    cy.get('#addJar').click();

    cy.wait(500)

    cy.get('#addJar').click();

    cy.get('#name-1').click();
    cy.get('#name-1').type('Jar 1');
    cy.get('#maxSize-1').click();
    cy.get('#maxSize-1').type('{backspace}');
    cy.get('#maxSize-1').type('2');

    cy.get('#name-2').click();
    cy.get('#name-2').type('Jar 2');
    cy.get('#maxSize-2').click();
    cy.get('#maxSize-2').type('{backspace}');
    cy.get('#maxSize-2').type('18');

    cy.get('#target-2').click();
    cy.get("#start").click()

    cy.wait(2000)

    cy.get(".ant-message-success").should("exist")


    cy.get("#step-list").find("div#step").should("have.length", 6)

  })

  it('should not find solution', () => {

    cy.visit('http://localhost:3000/');

    cy.get('#targetSize').click();
    cy.get('#targetSize').type('5');
    cy.get('#addJar').click();

    cy.wait(500)

    cy.get('#addJar').click();

    cy.get('#name-1').click();
    cy.get('#name-1').type('Jar 1');
    cy.get('#maxSize-1').click();
    cy.get('#maxSize-1').type('{backspace}');
    cy.get('#maxSize-1').type('2');

    cy.get('#name-2').click();
    cy.get('#name-2').type('Jar 2');
    cy.get('#maxSize-2').click();
    cy.get('#maxSize-2').type('{backspace}');
    cy.get('#maxSize-2').type('18');

    cy.get('#target-2').click();
    cy.get("#start").click()

    cy.wait(2000)

    cy.get(".ant-message-error").should("exist")

  })

})
