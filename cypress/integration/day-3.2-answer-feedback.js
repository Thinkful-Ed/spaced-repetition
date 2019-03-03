/// <reference types="Cypress" />

/**
 * @abstract:Feedback to my answer
 *
 * @criteria
  After submitting an answer on the learning page as a logged in user:
  - The app POSTs my answer for this word to the server
  - The server will update my appropriate scores in the database
  - After submitting, I get feedback whether I was correct or not
  - After submitting, I'm told the correct answer
  - My total score is updated
  - I'm told how many times I was correct or incorrect for the word
  - I can see a button/link to try another word
*/
describe(`User story: Answer feedback`, function() {
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

  context(`Given I submit my answer`, () => {
    beforeEach(() => {
      cy.route({
        method: 'POST',
        url: `/api/language/guess`,
        status: 200,
        response: 'fixture:language-guess-generic.json',
      })
        .as('postListGuess')
    })

    it(`submits my answer typed in the form`, () => {
      const guess = 'my-test-guess'

      cy.login().visit(`/learn`)
      cy.wait('@languageHeadRequest')

      cy.get('main form').within($form => {
        cy.get('input#learn-guess-input')
          .type(guess)

        cy.get('button').click()

        cy.wait('@postListGuess')
          .then(xhr => {
            expect(xhr.request.body).to.eql({ guess })
          })
      })
    })
  })

  context(`Given guess is incorrect`, () => {
    const guess = 'test-guess-incorrect'

    beforeEach(() => {
      cy.route({
        method: 'POST',
        url: `/api/language/guess`,
        status: 200,
        response: 'fixture:language-guess-incorrect.json',
      })
        .as('postListGuessIncorrect')

      cy.login().visit(`/learn`).wait('@languageHeadRequest')
      cy.get('input#learn-guess-input').type(guess)
      cy.get('form').submit().wait('@postListGuessIncorrect')
    })

    it(`displays score and feedback the word was incorrect`, () => {
      //  cypress fixtures has buggy behaviour, this works around it o_O
      const fixtures = []
      Cypress.Promise.all([
        cy.fixture('language-head.json')
          .then(langHeadFx => fixtures.push(langHeadFx)),
        cy.fixture('language-guess-incorrect.json')
          .then(langGuessIncFx => fixtures.push(langGuessIncFx)),
      ]).then(() => {
        const [languageHeadFixture, incorrectFixture] = fixtures

        cy.get('main').within($main => {
          cy.get('.DisplayScore p')
            .should(
              'have.text',
              `Your total score is: ${incorrectFixture.totalScore}`,
            )
          cy.get('h2')
            .should(
              'have.text',
              `Good try, but not quite right :(`,
            )
          cy.get('.DisplayFeedback p')
            .should(
              'have.text',
              `The correct translation for ${languageHeadFixture.nextWord} was ${incorrectFixture.answer} and you chose ${guess}!`,
            )
          cy.get('button')
            .should(
              'have.text',
              `Try another word!`,
            )
        })
      })
    })
  })

  context(`Given guess is correct`, () => {
    const guess = 'test-guess-incorrect'

    beforeEach(() => {
      cy.route({
        method: 'POST',
        url: `/api/language/guess`,
        status: 200,
        response: 'fixture:language-guess-correct.json',
      })
        .as('postListGuessCorrect')

      cy.login().visit(`/learn`).wait('@languageHeadRequest')
      cy.get('input#learn-guess-input').type(guess)
      cy.get('form').submit().wait('@postListGuessCorrect')
    })

    it(`gives feedback the word was correct`, () => {
      //  cypress fixtures has buggy behaviour, this works around it o_O
      const fixtures = []
      Cypress.Promise.all([
        cy.fixture('language-head.json')
          .then(fx => fixtures.push(fx)),
        cy.fixture('language-guess-correct.json')
          .then(fx => fixtures.push(fx)),
      ]).then(() => {
        const [languageHeadFixture, incorrectFixture] = fixtures

        cy.get('main').within($main => {
          cy.get('.DisplayScore p')
            .should(
              'have.text',
              `Your total score is: ${incorrectFixture.totalScore}`,
            )
          cy.get('h2')
            .should(
              'have.text',
              `You were correct! :D`,
            )
          cy.get('.DisplayFeedback p')
            .should(
              'have.text',
              `The correct translation for ${languageHeadFixture.nextWord} was ${incorrectFixture.answer} and you chose ${guess}!`,
            )
          cy.get('button')
            .should(
              'have.text',
              `Try another word!`,
            )
        })
      })
    })
  })
})
