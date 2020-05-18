import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from './../../components/Button/Button';
import ApiService from './../../services/api-service';

// - The app gets my language and words progress from the server
// - I'm shown my language
// - I'm shown the words to learn for the language
// - I'm shown my count for correct and incorrect responses for each word
// - I'm given a button/link to start learning
// - I'm shown the total score for guessing words correctly


class DashboardRoute extends Component {
  state = { 
    error: null,
    language: '',
    score: 0,
    wordsToPractice: ''
  }

  static defaultProps = {
    location: {},
    history: {
      push: () => { },
    },
  }

  componentDidMount() {
    ApiService.getLanguage()
      .then(data => {
        this.setState({
          language: data.language.name,
          score: data.language.total_score
        })
        console.log(data.words)
        this.renderWords(data.words)
      })

  }

  renderWords = (words) => {
    let wordsToPractice = words.map(word => {
      return <li className="word-to-practice">
        <p className="word">{word.original}</p>
        <p className="correct-guesses">You have guessed this word correctly 000 times</p>
        <p className="incorrect-guesses">You have guessed this word correctly 000 times</p>
      </li>
    })
    this.setState({
      wordsToPractice
    })
  }


  render() {
    return (
      <section className="dashboard">
        <h2>{this.state.language}</h2>
        <p className="score">Your Current Score: {this.state.score}</p>
        <h2>Words to Practice</h2>
        <ul>
          {this.state.wordsToPractice}
        </ul>
        <Link to="/learn">
          <Button>Start Practicing</Button>
        </Link>
      </section>  
    );
  }
}

export default DashboardRoute
