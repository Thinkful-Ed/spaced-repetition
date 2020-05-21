// import { Link } from "react-router-dom";
import Button from "./../../components/Button/Button";
import { Input, Label } from "../Form/Form";
import ApiService from "./../../services/api-service";

import React, { Component } from "react";

class LearningPage extends Component {
  state = {
    error: null,
    nextWord: "",
    score: 0,
    incorrect: 0,
    correct: 0,
  };

  static defaultProps = {
    location: {},
    history: {
      push: () => {},
    },
  };

  componentDidMount() {
    ApiService.getNextWord().then((data) => {
      this.setState({
        nextWord: data.nextWord,
        score: data.totalScore,
        incorrect: data.wordIncorrectCount,
        correct: data.wordCorrectCount
      })
    });
  }

  render() {

    const { nextWord, score, incorrect, correct, error} = this.state
    return (
      <section className="nextWord">
        <div role="alert">{error && <p>{error}</p>}</div>
        <p className="score">Your total score is: {score}</p>
        <h2>Translate the word: </h2>
        <span>{nextWord}</span>
        <p>You have answered this word correctly {correct} times.</p>
        <p>You have answered this word incorrectly {incorrect} times.</p>
        <form onSubmit={this.props.handleGuess}className="answer-form">
          <Label htmlFor="learn-guess-input">
            What's the translation for this word?
          </Label>
          <Input type="text" name="learn-guess-input" id="learn-guess-input" required></Input>
          <Button type="submit">Submit your answer</Button>
        </form>
      </section>
    );
  }
}

export default LearningPage;
