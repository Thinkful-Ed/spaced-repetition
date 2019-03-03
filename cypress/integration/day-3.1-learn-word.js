/// <reference types="Cypress" />

/**
 * @abstract:Learn the meaning of the word
 *
 * @criteria
  When viewing the learning page as a logged in user:
  - The app gets my next word to learn details from the server
  - I'm shown the word to learn
  - I'm shown my current total score
  - I'm shown the number of correct and incorrect guesses for that word
  - I'm presented an input to type my answer/guess for the current words translation
*/
describe(`User story: Presented with word`, function() {
  beforeEach(() => {
    cy.server()
      .route({
        method: 'GET',
        url: `/api/language/head`,
        status: 200,
        response: 'fixture:language-head.json',
      })
      .as('languageHeadRequest')
  })

  it('displays the current score and h2 with next word', () => {
    cy.login()
      .visit(`/learn`)
      .wait('@languageHeadRequest')

    cy.fixture('language-head.json')
      .then(languageHeadFixture => {
        cy.get('main').within($main => {
          cy.get('h2')
            .should('have.text', 'Translate the word:')
            .siblings('span')
            .should('have.text', languageHeadFixture.nextWord)
        })
        cy.get('p').eq(0)
          .should(
            'have.text',
            `Your total score is: ${languageHeadFixture.totalScore}`,
          )
      })
  })

  it(`displays a form for submitting the next guess`, () => {
    cy.login()
      .visit(`/learn`)
      .wait('@languageHeadRequest')

    cy.get('main form').within($form => {
      cy.get('label[for=learn-guess-input]')
        .should('have.text', `What's the translation for this word?`)

      cy.get('input#learn-guess-input')
        .should('have.attr', 'type', 'text')
        .and('have.attr', 'required', 'required')

      cy.get('button[type=submit]')
        .should('have.text', 'Submit your answer')
    })
  })

  it(`displays the correct and incorrect count for this word`, () => {
    cy.login()
      .visit(`/learn`)
      .wait('@languageHeadRequest')

    cy.fixture('language-head.json').then(languageHeadFixture => {
      cy.get('main').within($main => {
        cy.root()
          .should(
            'contain',
            `You have answered this word correctly ${languageHeadFixture.wordCorrectCount} times.`,
          )
          .and(
            'contain',
            `You have answered this word incorrectly ${languageHeadFixture.wordIncorrectCount} times.`,
          )
      })
    })
  })
})
