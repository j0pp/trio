// React
import React from 'react';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

// Components
import Statistics from './Statistics'; 
import Game from './Game';
import SuggestionForm from './SuggestionForm';
import Instructions from './Instructions';
import { ChartBarIcon, QuestionMarkCircleIcon, MoonIcon, LightBulbIcon, HomeIcon } from '@heroicons/react/solid'
// import {
//   ChartBarIcon as ChartBarOutline,
//   QuestionMarkCircleIcon as QMarkOutline,
//   MoonIcon as MoonOutline,
//   LightBulbIcon as LightBulbOutline,
//   HomeIcon as HomeOutline } from '@heroicons/react/outline'
//import { ShareIcon } from '@heroicons/react/outline'

// Other
import './index.css';
import { puzzles } from './puzzles';

class App extends React.Component {
  constructor(props) {
    super(props)
    let buildState = {id: null};
    
    const dateGameStarted = new Date('02/16/2022');
    let today = new Date();
    const puzzleNumber = Math.floor((today.getTime() - dateGameStarted.getTime()) / (1000 * 3600 * 24));
    const puzzle = puzzles[puzzleNumber];

    const seenHelp = localStorage.getItem('help');
    const storedState = JSON.parse(localStorage.getItem(puzzleNumber));

    if (storedState) {
      // Implement restoring of game state
      buildState.game = storedState;
    } else {
      buildState.game = []
      for (let i = 0; i < 3; i++) {
        buildState.game.push({puzzle: puzzle[i], startTime: null, solvedTime: null});
      }
    }
    
    buildState.id = puzzleNumber;
    buildState.seenHelp = seenHelp;
    this.state = buildState;
  }

  componentDidMount() {
    let state = this.state;
    state.seenHelp = 'seen';
    this.setState(state);
    localStorage.setItem('help', 'seen');
  }

  storeState() {
    localStorage.setItem(this.state.id, JSON.stringify(this.state.game));
  }

  async puzzleSolved(i, time) {
    let state = this.state;
    state.game[i].solvedTime = time;
    this.setState(state);
    this.storeState();
    /*
    if (i === 2) {
      let x = 0;
      let flash = setInterval(() => {
        this.handleDarkMode();
        if (x === 5) {
          clearInterval(flash);
        }
        x++;
      }, 500);
    }
    */
  }

  handleDarkMode() {
    let state = this.state;
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      state.theme = 'light';
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      state.theme = 'dark';
    }
    this.setState(state);
  }

  render() {
    return (
      <Router>
      <div className="w-screen h-screen">
        <div className="flex justify-center font-mono text-7xl pt-3 font-bold">
          Trio
        </div>
          <div className="flex justify-center font-mono font-bold">
            <Link to="/game">
              <HomeIcon
                className="h-7 w-7 mx-3 cursor-pointer"
              />
            </Link>
            <Link to="/info">
              <QuestionMarkCircleIcon
                className="h-7 w-7 mx-3 cursor-pointer"
              />
            </Link>
            <Link to="/stats">
              <ChartBarIcon
                className="h-7 w-7 mx-3 cursor-pointer"
              />
            </Link>
            <div className='mx-3'>
              <Link to="/suggestions">
                <LightBulbIcon
                  className="h-7 w-7 cursor-pointer"
                />
              </Link>
            </div>
            <MoonIcon
              onClick={() => this.handleDarkMode()}
              className="h-7 w-7 mx-3 cursor-pointer"
            />
          </div>
          <Routes>
            <Route path='/' element={
              this.state.seenHelp ? 
              <Navigate to='/game' />
              :
              <Navigate to='/info' />
            
            } />
            <Route path='/game' element={<Game
              state={this.state}
              onSolve={(i, time) => this.puzzleSolved(i, time)}
            />} />
            <Route path='/info' element={<Instructions/>} />
            <Route path='/stats' element={
            <Statistics
              key={this.state.theme}
              currState={this.state}
              theme={this.state.theme}
            />
            } />
            <Route path='/suggestions' element={<SuggestionForm/>} />
          </Routes>
      </div>
      </Router>
    );
  }
}

// ========================================

document.body.className = "bg-yellow-50 dark:bg-black text-black dark:text-yellow-50"

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


