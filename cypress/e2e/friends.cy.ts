describe('Friends functionality', () => {
  const randomNumber = Math.floor(Math.random() * 1000000)

  beforeEach(() => {
    cy.login('duda@test.com', '12345678')
  })

  it('should create an anonymous friend', () => {
    cy.visit('create-match')
    cy.get('li')
      .eq(0)
      .findByRole('combobox', { name: 'Add player' })
      .type('Player test')
      .type('{enter}')
    cy.get('li')
      .eq(0)
      .findByRole('combobox', { name: 'Add player' })
      .should('have.value', 'Player test')
  })

  it('should check with the new anonymous friend is in the page', () => {
    cy.visit('friends')
    cy.get('input[type="text"][value="Player test"]')
      .should('be.visible')
      .should('be.disabled')
  })

  it('should edit an anonymous friend', () => {
    cy.visit('friends')

    cy.findByTestId('menu-anonFriend-player-test')
      .findByRole('button', { name: 'edit' })
      .click()
    cy.get('input[value="Player test"]').should('not.be.disabled')
    cy.get('input[value="Player test"]')
      .clear()
      .type(`New player ${randomNumber}`)
    cy.findByTestId('menu-anonFriend-player-test')
      .findByRole('button', { name: 'edit' })
      .click()
    cy.get(`input[value='New player ${randomNumber}']`).should('be.disabled')
  })

  it('should delete an anonymous friend', () => {
    cy.visit('friends')
    cy.findByTestId(`menu-anonFriend-new-player-${randomNumber}`)
      .findByRole('button', { name: 'delete' })
      .click()
    cy.findByRole('button', { name: 'Confirm' }).click()
    cy.get(`input[value='New player ${randomNumber}']`).should('not.exist')
  })
})
