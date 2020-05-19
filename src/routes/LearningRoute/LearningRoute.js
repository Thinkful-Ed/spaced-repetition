import React, { Component } from "react";
import LearningPage from "../../components/LearningPage/LearningPage";

class LearningRoute extends Component {
  state = { 
    error: null,
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
    return (
      <section>
        <LearningPage />
      </section>
    );
  }
}

export default LearningRoute;
