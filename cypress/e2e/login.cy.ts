describe('Login functionality', () => {
  it('should log in successfully', () => {
    cy.visit('login')
    cy.get('input[name="email"]').type('duda@test.com')
    cy.get('input[name="password"]').type('12345678')
    cy.findByRole('button', { name: 'Login' }).click()
    cy.url().should('include', '/matches')
  })

  it('should check if the register link is working', () => {
    cy.visit('login')
    cy.findByRole('link', { name: 'Register now!' }).click()
    cy.url().should('include', 'signup')
  })
})
