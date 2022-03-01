import React from 'react';
import ReactDOM from 'react-dom';
import { ChartBarIcon, QuestionMarkCircleIcon, MoonIcon, LightBulbIcon } from '@heroicons/react/solid'
//import { ShareIcon } from '@heroicons/react/outline'
import './index.css';
import { puzzles } from './puzzles';
import db from './firebase';
import { doc, setDoc } from "firebase/firestore";
import Statistics from './Statistics'; 
import Game from './Game';
import SuggestionForm from './SuggestionForm';
import Instructions from './Instructions';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";

// Components


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

  enableStart(i) {
    if (i === 0) {
      return true;
    } else {
      return this.state.game[i - 1].solvedTime;
    }
  }

  setStartedTime(i, time) {
    let state = this.state;
    state.game[i].startTime = time;
    this.setState(state);
    this.storeState();
  }

  async puzzleSolved(i, time) {
    let state = this.state;
    console.log(state)
    state.game[i].solvedTime = time;
    this.setState(state);
    this.storeState();
    let difficulties = ['easy', 'medium', 'hard']
    const docData = {
      solvedTime: time
    };
    await setDoc(doc(db, 'puzzles/' + state.id + difficulties[i] + '/players', Math.floor(Math.random() * 1000).toString()), docData);

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
  }

  handleDarkMode() {
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    }
  }

  // TODO:
  // sharePuzzle() {
  //   /* Get the text field */
  //   let copyText = '';
  
  //   /* Select the text field */
  //   copyText.select();
  //   copyText.setSelectionRange(0, 99999); /* For mobile devices */
  
  //     /* Copy the text inside the text field */
  //   navigator.clipboard.writeText(copyText.value);
  
  //   /* Alert the copied text */
  //   alert("Copied the text: " + copyText.value);
  // }

  render() {
    return (
      <Router>
      <div className="w-screen h-screen">
        <div className="flex justify-center font-mono text-7xl pt-3 font-bold">
          Trio
        </div>
          <div className="flex justify-center font-mono font-bold">
            <Link to="/info">
              <QuestionMarkCircleIcon
                className="h-7 w-7 mx-3 cursor-pointer"
                onClick={() => console.log(0)}
              />
            </Link>
            <Link to="/stats">
              <ChartBarIcon
                className="h-7 w-7 mx-3 cursor-pointer"
                onClick={() => console.log(0)}
              />
            </Link>
            <div className='mx-3'>
              <Link to="/suggestions">
                <LightBulbIcon
                  className="h-7 w-7 cursor-pointer"
                  onClick={() => console.log(0)}
                />
              </Link>
              <p className='text-xs text-center'>NEW</p>
            </div>
            <MoonIcon onClick={() => this.handleDarkMode()} className="h-7 w-7 mx-3 cursor-pointer"/>
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
            />} />
            <Route path='/info' element={<Instructions/>} />
            <Route path='/stats' element={
            <Statistics
              solved={1}
              currState={this.state}
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
