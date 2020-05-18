// - The app gets my language and words progress from the server
// - I'm shown my language
// - I'm shown the words to learn for the language
// - I'm shown my count for correct and incorrect responses for each word
// - I'm given a button/link to start learning
// - I'm shown the total score for guessing words correctly

import React, { Component } from "react";
import LearningPage from "../../components/LearningPage/LearningPage";

class LearningRoute extends Component {
  state = { error: null }

  static defaultProps = {
    location: {},
    history: {
      push: () => { },
    },
  }

  componentDidMount() {
    
  }

  
  render() {
    return (
      <section>
        <LearningPage />
      </section>
    );
  }
}

export default LearningRoute
