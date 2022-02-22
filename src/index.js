import React from 'react';
import ReactDOM from 'react-dom';
import { ChartBarIcon, QuestionMarkCircleIcon, MoonIcon, LightBulbIcon } from '@heroicons/react/solid'
import { ShareIcon } from '@heroicons/react/outline'
import './index.css';
import { puzzles } from './puzzles';

// Components
import Puzzle from './Puzzle';
import SuggestionForm from './SuggestionForm';

class Game extends React.Component {
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
    buildState.page = seenHelp ? 1 : 0;
    this.state = buildState;
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

  puzzleSolved(i, time) {
    let state = this.state;
    state.game[i].solvedTime = time;
    this.setState(state);
    this.storeState();

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

  setPage(i) {
    let state = this.state;
    state.page = i;
    this.setState(state);
    if (i === 1) {
      localStorage.setItem('help', 'seen');
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
      <div className="w-screen h-screen">
        <div className="flex justify-center font-mono text-7xl pt-3 font-bold">
          Trio
        </div>
        <div className="flex justify-center font-mono font-bold">
          <QuestionMarkCircleIcon
            className="h-7 w-7 mx-3 cursor-pointer"
            onClick={() => this.setPage(0)}
          />
          <ChartBarIcon
            className="h-7 w-7 mx-3 cursor-pointer"
            onClick={() => this.setPage(2)}
          />
          <div className='mx-3'>
            <LightBulbIcon
              className="h-7 w-7 cursor-pointer"
              onClick={() => this.setPage(3)}
            />
            <p className='text-xs text-center'>NEW</p>
          </div>
          <MoonIcon onClick={() => this.handleDarkMode()} className="h-7 w-7 mx-3 cursor-pointer"/>
        </div>
        <div
          className='w-screen h-28 mx-auto px-5 font-mono mt-4 md:w-1/2'
          hidden={this.state.page !== 0}
        >
          <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
            Trio is a daily word game based on the <a className="text-blue-300" target="_blank" href="https://en.wikipedia.org/wiki/Remote_Associates_Test" rel="noreferrer">Remote Associates Test</a>. You will be prompted with three different
            words and a timer will start. For example, the words may be
          </p>
          <p className="my-4 text-blueGray-500 text-lg leading-relaxed">cottage / swiss / cake</p>
          <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
            Your job is to figure out the
            word that is the 'missing link'. In this case, the answer is
            <em> cheese</em> (cottage <em>cheese</em>, swiss <em> cheese</em>, and <em>cheese </em>cake).
            The answer can be a prefix or suffix for each clue word.
          </p>
          <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
            There is no penalty for guessing, your final time is the only
            thing that counts.
          </p>
          <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
            <em>Contact: <a className="text-pink-300" href="mailto: beaubien.jon@gmail.com" rel="noreferrer">beaubien.jon@gmail.com</a></em>
          </p>
          <div className='text-center'>
            <button
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => this.setPage(1)}
            >
              Go to game
            </button>
          </div>
          
        </div>
        <div hidden={this.state.page !== 1}>
          <div className="flex justify-center font-mono font-italic font-bold mt-5">
            Puzzle #{46 + this.state.id}
          </div>
          <div className="flex justify-center font-mono font-italic font-bold text-xs">
            (next puzzle in {24 - (new Date().getHours())} hrs)
          </div>
          <div className="w-screen mx-auto font-mono mt-4">
            <Puzzle
              title='Easy'
              startTime={this.state.game[0].startTime}
              puzzle={this.state.game[0].puzzle}
              solvedTime={this.state.game[0].solvedTime}
              onSolve={(time) => this.puzzleSolved(0, time)}
              enableStart={() => this.enableStart(0)}
              setStartedTime={(time) => this.setStartedTime(0, time)}
            />
          </div>
          <div className="w-screen mx-auto font-mono mt-6">
            <Puzzle
              title='Medium'
              startTime={this.state.game[1].startTime}
              puzzle={this.state.game[1].puzzle}
              solvedTime={this.state.game[1].solvedTime}
              onSolve={(time) => this.puzzleSolved(1, time)}
              enableStart={() => this.enableStart(1)}
              setStartedTime={(time) => this.setStartedTime(1, time)}
            />
          </div>
          <div className="w-screen mx-auto font-mono mt-6">
            <Puzzle
              title='Hard'
              startTime={this.state.game[2].startTime}
              puzzle={this.state.game[2].puzzle}
              solvedTime={this.state.game[2].solvedTime}
              onSolve={(time) => this.puzzleSolved(2, time)}
              enableStart={() => this.enableStart(2)}
              setStartedTime={(time) => this.setStartedTime(2, time)}
            />
          </div>
          {/* <div className='flex justify-center font-mono font-italic font-bold mt-3'>
          <button
            className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
            hidden={this.state.game[this.state.game.length].solvedTime}
            onClick={() => {this.sharePuzzle()}}
          >
            <ShareIcon
              className="h-7 w-7 mx-3"
            />
            Share
          </button>
        </div> */}
        </div>
        
        <div
          className='w-screen h-28 mx-auto px-5 font-mono mt-4 md:w-1/2 text-center'
          hidden={this.state.page !== 2}
        >
          <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
            Statistics coming soon.
          </p>
          <button
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => this.setPage(1)}
          >
            Back to game
          </button>
        </div>

        <div
          className='w-screen h-28 mx-auto px-5 font-mono mt-4 md:w-1/2 text-center'
          hidden={this.state.page !== 3}
        >
          <SuggestionForm />
          <button
            className="mt-10 text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => this.setPage(1)}
          >
            Back to game
          </button>
        </div>
        
      </div>
    );
  }
}

// ========================================

document.body.className = "bg-yellow-50 dark:bg-black text-black dark:text-yellow-50"

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
