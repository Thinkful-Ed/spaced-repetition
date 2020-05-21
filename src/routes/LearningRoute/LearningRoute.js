import React, { Component } from "react";
import LearningPage from "../../components/LearningPage/LearningPage";
import ApiService from "../../services/api-service";
import Button from "./../../components/Button/Button";


class LearningRoute extends Component {
  state = { 
    error: null,
    showResults: false,
    wasUserCorrect: false,
    correctCount: 0,
    incorrectCount: 0,
    score: 0,
    isCorrect: false,
    original: '',
    translation: '',
    guess: ''
  };

  static defaultProps = {
    location: {},
    history: {
      push: () => {},
    },
  };

  handleGuess = (e) => {
    e.preventDefault();

    let guess = e.target['learn-guess-input'].value
    this.setState({
      guess
    })
    ApiService.getResults(guess).then((data) => {
      this.setState({ 
        nextWord: data.nextWord,
        score: data.totalScore,
        incorrect: data.wordIncorrectCount,
        correct: data.wordCorrectCount,
        isCorrect: data.isCorrect,
        showResults: true,
        translation: data.answer,
      })
      });
  }


  handleNextWord = () => {
    this.setState({
      showResults: false
    })
  }

  renderResults = () => {
    let {isCorrect, guess, original, translation, score} = this.state
    return <div className="results">
      {isCorrect ? <p>You were correct! :D</p> : <p>Good try, but not quite right :(</p> }
      <p>The correct translation for {original} was {translation} and you chose {guess}!</p>
      <p>Your total score is: {score} </p>
      <Button onClick={this.handleNextWord}>Try another word!</Button>
      </div>
  }

  handleNextWord = (e) => {

  }


  render() {
    return (
      <section>
      {this.state.showResults ? this.renderResults() : <LearningPage handleGuess={this.handleGuess}/>}
        
      </section>
    );
  }
}

export default LearningRoute;
