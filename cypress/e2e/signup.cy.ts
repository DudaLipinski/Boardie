describe('Signup test', () => {
  const randomNumber = Math.floor(Math.random() * 1000000)

  it('Should create a new account', () => {
    cy.visit('signup')
    cy.get('input[name="firstName"]').type('Maria')
    cy.get('input[name="middleAndSurname"]').type('Lipinski')
    cy.get('input[name="email"]').type(`${randomNumber}@test.com`)
    cy.get('input[name="age"]').type('24')
    cy.get('input[name="password"]').type('12345678')
    cy.findByRole('button', { name: 'Create account' }).click()
  })

  it('Should login after creating account', () => {
    cy.login(`${randomNumber}@test.com`, '12345678')
  })
})
