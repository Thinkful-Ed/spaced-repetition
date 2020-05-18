import { Link } from 'react-router-dom';
import Button from './../../components/Button/Button';
import { Input, Required, Label } from '../Form/Form'

import React, { Component } from "react";

class LearningPage extends Component {
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
        <h1>Name of App</h1>
        {/* Language goes here */}
        <p className="score">Your Current Score: </p>
        <h2>Translate The Word:</h2>
        <p>You have guessed this word correctly xxxx times</p>
        <p>You have guessed this word incorrectly xxxx times</p>
      </section>
    );
  }
}

export default LearningPage

