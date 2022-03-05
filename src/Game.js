// React
import React from 'react';
import { Link } from 'react-router-dom';

// Components
import Puzzle from './Puzzle';
import { ShareIcon, ChartBarIcon } from '@heroicons/react/solid';

// Utils
import { formatTime } from './utils/utils';

// Firebase
import db from './firebase';
import { doc, setDoc } from "firebase/firestore";

class Game extends React.Component {
    constructor(props) {
        super(props)
        /*
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
        */
        this.state = this.props.state;
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
      this.props.onSolve(i, time)
      let state = this.state;
      state.game[i].solvedTime = time;
      
      let difficulties = ['easy', 'medium', 'hard']
      const docData = {
        solvedTime: time,
        name: ''
      };
      if (!state.uuid) {
        state.uuid = Date.now().toString(16) + Math.random().toString(16)
      }
      this.setState(state);
      this.storeState();
      await setDoc(doc(db, 'puzzles/' + state.id + difficulties[i] + '/players', state.uuid), docData);
  
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

    sharePuzzle = () => {
          /* Get the text field */
      let copyText = 'https://wordtrio.com \n';
      this.state.game.forEach((puzzle) => {
        copyText += formatTime(puzzle.solvedTime) + '\n'
      });
      let puzzleNum = this.state.id + 46;
      copyText += 'puzzle #' + puzzleNum;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(copyText).then(() => {
          alert("Copied the text: " + copyText);
        }, (err) => {
          console.log('Failed to copy the text to clipboard.', err);
        });
      } else if (window.clipboardData) {
        window.clipboardData.setData("Text", copyText);
      }
    }
    
    render() {
        return (
        <div>
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
            <div className='flex justify-center font-mono font-italic font-bold my-3'>
              <button
                  className='rounded-lg border-2 p-2 border-black dark:border-yellow-50'
                  hidden={!this.state.game[this.state.game.length - 1].solvedTime}
                  onClick={this.sharePuzzle}
              >
                  <ShareIcon
                  className="h-7 w-7 mx-3"
                  />
                  Share
              </button>
              <Link to="/stats">
                <button
                    className='rounded-lg border-2 p-2 border-black dark:border-yellow-50 ml-3'
                    hidden={!this.state.game[this.state.game.length - 1].solvedTime}
                >
                    <ChartBarIcon
                    className="h-7 w-7 mx-3"
                    />
                    Stats
                </button>
              </Link>
            </div>
            
        </div>
        );
    }
}

export default Game;
