/// <reference types="Cypress" />
import * as helpers from '../support/helpers'

/**
 * @abstract: Login
 *
 * @criteria
  On any visit when I'm not logged in:
  - I can navigate to the "login" page.

  As a registered user on the login page:
  - I can navigate back to the register page.
  - I can enter my username and password.
  - If my submitted username and password are incorrect: I'm given an appropriate error message so that I can attempt to login again.
  - If my submitted username and password are correct: the app "logs me in" and redirects me to my dashboard.

  As a logged in user:
  - The app displays my name and presents a logout button.
  - The application refreshes my auth token so that I can remain logged in when active on the page.

  As a logged in user who is starting a new session:
  - The application remembers that I'm logged in and doesn't redirect me to the registration page.
*/
describe(`User story: Login`, function() {
  it(`has navigation to login page in nav and form`, () => {
    cy.visit('/')

    cy.get('header nav').within($nav => {
      cy.get('a[href="/login"]')
        .should('be.visible')
        .and('have.text', 'Login')
    })

    cy.get('main section').within($nav => {
      cy.get('a[href="/login"]')
        .should('be.visible')
        .and('have.text', 'Already have an account?')
        .click()
        .url()
        .should('eq', `${Cypress.config().baseUrl}/login`)
    })
  })

  it(`allows navigation back to the registration page`, () => {
    cy.visit('/login')
      .get('a[href="/register"]')
      .should('be.visible')
      .and('have.text', 'Sign up')
  })

  it('displays the login page', () => {
    cy.visit('/login')

    cy.get('main section').within($section => {
      cy.get('h2').should(
        'have.text',
        'Login',
      )
    })
  })

  it(`displays the username and password fields`, () => {
    cy.visit('/login')

    cy.get('section form').within(() => {
      cy.get('label[for=login-username-input]')
        .should('have.text', 'Username')
      cy.get('input#login-username-input')
        .should('have.attr', 'type', 'text')
        .and('have.attr', 'required', 'required')

      cy.get('label[for=login-password-input]')
        .should('have.text', 'Password')
      cy.get('input#login-password-input')
        .should('have.attr', 'type', 'password')
        .and('have.attr', 'required', 'required')

      cy.get('button[type=submit]')
        .should('have.text', 'Login')
    })
  })

  context(`Given invalid credentials`, () => {
    beforeEach(() => {
      cy.server()
        .route({
          method: 'POST',
          url: '/api/auth/token',
          // server determines credentials are incorrect
          status: 400,
          response: {
            error: 'Incorrect username or password'
          },
        })
        .as('loginRequest')
    })

    it(`displays error from POSTS /api/auth/token`, () => {
      const newUser = {
        username: 'invalid-username',
        password: 'invalid-password',
      }
      cy.visit('/login')

      cy.get('main form').within($form => {
        cy.get('#login-username-input')
          .type(newUser.username)
        cy.get('#login-password-input')
          .type(newUser.password)
        cy.root()
          .submit()

        cy.wait('@loginRequest')
          .get('[role=alert]')
          .should('have.text', 'Incorrect username or password')

        cy.url()
          .should('eq', `${Cypress.config().baseUrl}/login`)
      })
    })
  })

  context(`Given valid credentials`, () => {
    const loginToken = helpers.makeLoginToken()

    beforeEach(() => {
      cy.server()
        .route({
          method: 'POST',
          url: '/api/auth/token',
          // server determins credentials are correct
          status: 200,
          response: {
            authToken: loginToken
          },
        })
        .as('loginRequest')

      cy.route({
          method: 'PUT',
          // server determins refresh is correct
          url: '/api/auth/token',
          status: 200,
          response: {
            authToken: loginToken
          },
        })
        .as('refreshRequest')

      cy.route({
          method: 'GET',
          url: '/api/language',
          // minimal happy response from language endpoint
          status: 200,
          response: {
            language: {},
            words: [],
          },
        })
        .as('languageRequest')
    })

    it(`stores token in localStorage and redirects to /`, () => {
      const loginUser = {
        username: 'username',
        password: 'password',
      }
      cy.visit('/login')

      cy.get('main form').within($form => {
        cy.get('#login-username-input')
          .type(loginUser.username)
        cy.get('#login-password-input')
          .type(loginUser.password)
        cy.root()
          .submit()

        cy.wait('@loginRequest')
          .window()
          .then(win => {
            const tokenInStorage = win.localStorage.getItem(
              Cypress.env('TOKEN_KEY')
            )
            expect(tokenInStorage).to.eql(loginToken)
          })

        cy.url()
          .should('eq', `${Cypress.config().baseUrl}/`)
      })
    })

    it(`displays my user name and presents the logout button`, () => {
      cy.login().visit('/')

      cy.get('header').within($header => {
        cy.contains('Test name of user').should('exist')
        cy.get('nav a')
          .should('have.length', 1)
          .and('have.text', 'Logout')
          .and('have.attr', 'href', '/login')

        cy.get('nav a')
          .click()
          .url()
          .should('eq', `${Cypress.config().baseUrl}/login`)

        cy.window()
          .then(win => {
            const tokenInStorage = win.localStorage.getItem(
              Cypress.env('TOKEN_KEY')
            )
            expect(tokenInStorage).to.not.exist
          })
      })
    })

    it(`keeps refreshing the token before it expires`, () => {
      const loginUser = {
        username: 'username',
        password: 'password',
      }
      cy.clock().visit('/login')

      // cy.login() uses localStorage directly. So...
      // need to ensure the refresh login still applies after using login form
      cy.get('main form').within($form => {
        cy.get('#login-username-input')
          .type(loginUser.username)
        cy.get('#login-password-input')
          .type(loginUser.password)

        cy.root().submit()

        cy.wait('@loginRequest')

        cy.tick(20000).wait('@refreshRequest')
        cy.tick(20000).wait('@refreshRequest')
      })
    })

    it(`refreshes tokens loaded from localStorage`, () => {
      cy.login().clock().visit('/')
      cy.tick(20000).wait('@refreshRequest')
      cy.tick(20000).wait('@refreshRequest')
    })

    it(`doesn't redirect on page load when valid token in localStorage`, () => {
      cy.login()
        .visit('/')
        .url()
        .should('not.contain', `/register`)
        .and('not.contain', `/login`)
    })
  })
})
