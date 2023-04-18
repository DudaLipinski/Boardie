import '@testing-library/cypress/add-commands'

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request('POST', `http://localhost:3007/auth`, { email, password }).then(
    (response) => {
      cy.setCookie('token', response.body.token)
    }
  )
})
