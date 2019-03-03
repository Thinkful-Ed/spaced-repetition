/// <reference types="Cypress" />

/**
 * @abstract: Create an account
 *
 * @criteria
  As first time visiting user:
  - I'm directed to a registration page.
  - On that page, I can enter my name, username, and password.
  - If all my information is correct, upon clicking the submit button, I'm taken to a login page.
  - If any of my information is incorrect, I'm given proper error messages and the option to correct my information
*/
describe(`User story: Register an account`, function() {
  it('on first load, directs me to the registration page', () => {
    cy.visit('/')
    cy.url()
      .should('eq', `${Cypress.config().baseUrl}/register`)

    cy.get('main section').within($section => {
      cy.get('h2')
        .should('have.text', 'Sign up')
    })
  })

  it(`displays the name, username and password fields`, () => {
    cy.visit('/register')

    cy.get('section form').within(() => {
      cy.get('label[for=registration-name-input]')
        .should('have.text', 'Enter your name*')
      cy.get('input#registration-name-input')
        .should('have.attr', 'type', 'text')
        .and('have.attr', 'required', 'required')

      cy.get('label[for=registration-username-input]')
        .should('have.text', 'Choose a username*')
      cy.get('input#registration-username-input')
        .should('have.attr', 'type', 'text')
        .and('have.attr', 'required', 'required')

      cy.get('label[for=registration-password-input]')
        .should('have.text', 'Choose a password*')
      cy.get('input#registration-password-input')
        .should('have.attr', 'type', 'password')
        .and('have.attr', 'required', 'required')

      cy.get('button[type=submit]')
        .should('have.text', 'Sign up')
    })
  })

  context(`Given invalid information`, () => {
    const serverError = 'Some error from the server'

    beforeEach(() => {
      cy.server()
        .route({
          method: 'POST',
          url: '/api/user',
          // server determines the information is incorrect
          status: 400,
          response: {
            error: serverError
          },
        })
        .as('postRegister')
    })

    it(`displays error from POSTS /api/users`, () => {
      const newUser = {
        name: 'Test name',
        username: 'invalid-username',
        password: 'invalid-password',
      }
      cy.visit('/register')

      cy.get('main form').within($form => {
        cy.get('#registration-name-input')
          .type(newUser.name)
        cy.get('#registration-username-input')
          .type(newUser.username)
        cy.get('#registration-password-input')
          .type(newUser.password)
        cy.root().submit()

        cy.wait('@postRegister')
          .get('[role=alert]')
          .should('have.text', serverError)
      })
    })
  })

  context(`Given valid information`, () => {
    beforeEach(() => {
      cy.server()
        .route({
          method: 'POST',
          url: '/api/user',
          // server determines the information is correct
          status: 200,
          response: {
            id: 123,
            name: 'test name',
            username: 'test username',
          },
        })
        .as('postRegister')
    })

    it(`redirects to /login`, () => {
      const newUser = {
        name: 'Test name',
        username: 'test-username',
        password: 'test-password',
      }
      cy.visit('/register')

      cy.get('section form').within($form => {
        cy.get('#registration-name-input')
          .type(newUser.name)
        cy.get('#registration-username-input')
          .type(newUser.username)
        cy.get('#registration-password-input')
          .type(newUser.password)
        cy.root().submit()
        cy.wait('@postRegister')
          .url()
          .should('eq', `${Cypress.config().baseUrl}/login`)
      })
    })
  })
})
