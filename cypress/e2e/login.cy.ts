describe('Login functionality', () => {
  it('should log in successfully', () => {
    cy.login('duda@test.com', '12345678')
    cy.url().should('include', '/matches')
  })

  it('should check if the register link is working', () => {
    cy.visit('login')
    cy.findByRole('link', { name: 'Register now!' }).click()
    cy.url().should('include', 'signup')
  })
})
