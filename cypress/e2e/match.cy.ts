describe('Match functionality', () => {
  beforeEach(() => {
    cy.login('duda@test.com', '12345678')
  })

  it('should direct to page match creation when the + button is clicked', () => {
    cy.visit('matches')
    cy.url().should('include', 'matches')
    cy.findByRole('button', { name: 'Create match' }).click()
    cy.url().should('include', 'create-match')
  })

  it('should create a new match with the basics fields', () => {
    cy.visit('create-match')
    cy.findByRole('textbox', { name: 'Boardgame' }).type('Everdell')
    cy.findByTestId('remove-player-1').click()
    cy.findByRole('button', { name: 'Save' }).click()
    cy.url().should('include', 'edit-match')
  })

  it('should update the match', () => {
    cy.visit('matches')
    cy.get('li').eq(0).findByRole('button', { name: 'fade-button' }).click()
    cy.findByRole('menuitem', { name: 'Edit match' }).click()
    cy.url().should('include', 'edit-match')

    cy.findByRole('textbox', { name: 'Boardgame' }).clear().type('Catan')
    cy.findByRole('textbox', { name: 'Notes' }).type('Nice note')
    cy.findByRole('button', { name: 'Add new +' }).click()
    cy.get('li')
      .eq(1)
      .findByRole('combobox', { name: 'Add player' })
      .type('Leonardo Diehl')
      .type('{enter}')
    cy.findByRole('button', { name: 'Save' }).click()

    cy.findByRole('textbox', { name: 'Boardgame' }).should(
      'have.value',
      'Catan'
    )
    cy.findByRole('textbox', { name: 'Notes' }).should(
      'have.value',
      'Nice note'
    )
    cy.get('li')
      .eq(1)
      .findByRole('combobox', { name: 'Add player' })
      .should('have.value', 'Leonardo Diehl')
  })

  it('should delete the match', () => {
    cy.visit('matches')
    cy.get('li').eq(0).findByRole('button', { name: 'fade-button' }).click()
    cy.findByRole('menuitem', { name: 'Delete match' }).click()
    cy.findByRole('button', { name: 'Confirm' }).click()
    cy.get('li').should('not.exist')
  })
})
