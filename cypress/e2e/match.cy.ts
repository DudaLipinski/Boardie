describe('Match tests', () => {
  it('Shoudl create a new match', () => {
    cy.visit('/matches')
    cy.findByRole('button', { name: 'Create match' }).click()
  })
})
