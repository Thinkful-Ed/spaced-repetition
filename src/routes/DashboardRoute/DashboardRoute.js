import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from './../../components/Button/Button';


// - The app gets my language and words progress from the server
// - I'm shown my language
// - I'm shown the words to learn for the language
// - I'm shown my count for correct and incorrect responses for each word
// - I'm given a button/link to start learning
// - I'm shown the total score for guessing words correctly


class DashboardRoute extends Component {
  state = { error: null }

  static defaultProps = {
    location: {},
    history: {
      push: () => { },
    },
  }

  componentDidMount() {
    
  }

  renderWords = () => {
    return (
      <li className="word-to-practice">
        <p className="word">{word}</p>
        <p className="correct-guesses">You have guessed this word correctly {correct} times</p>
        <p className="incorrect-guesses">You have guessed this word correctly {incorrect} times</p>

      </li>
    )
  }


  render() {
    return (
      <section className="dashboard">
        <h1>Name of App</h1>
        {/* Language goes here */}
        <p className="score">Your Current Score: </p>
        <h2>Words to Practice</h2>
        <ul>
          {this.renderWords()}
        </ul>
        <Link to="/learn">
          <Button>Start Practicing</Button>
        </Link>
      </section>  
    );
  }
}

export default DashboardRoute
