describe('Signup test', () => {
  const randomNumber = Math.floor(Math.random() * 1000000)

  it('Should create a new account', () => {
    cy.visit('http://localhost:3000/create-account')
    cy.get('input[name="firstName"]').type('Maria')
    cy.get('input[name="middleAndSurname"]').type('Lipinski')
    cy.get('input[name="email"]').type(`${randomNumber}@test.com`)
    cy.get('input[name="age"]').type('24')
    cy.get('input[name="password"]').type('12345678')
    cy.findByRole('button', { name: 'Create account' }).click()
  })

  it('Should throw an error when the user already exists', () => {
    cy.visit('http://localhost:3000/create-account')
    cy.get('input[name="firstName"]').type('Maria')
    cy.get('input[name="middleAndSurname"]').type('Lipinski')
    cy.get('input[name="email"]').type(`${randomNumber}@test.com`)
    cy.get('input[name="age"]').type('24')
    cy.get('input[name="password"]').type('12345678')
    cy.findByRole('button', { name: 'Create account' }).click()
    cy.findByTestId('signup-error')
      .should('be.visible')
      .should('have.text', 'User already exists with given email')
  })
})
