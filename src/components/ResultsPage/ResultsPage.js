import ApiService from "./../../services/api-service";

import React, { Component } from "react";

class ResultsPage extends Component {
  state = {
    error: null,
    nextWord: "",
    score: 0,
    wasUserCorrect: false,
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

  }

  render() {
    let {score, correct, incorrect, wasUserCorrect} = this.state
    return (
      <section className="results">

      </section>
    )
  }
}



export default ResultsPage;
