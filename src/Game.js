import React from 'react';
import Puzzle from './Puzzle';

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
        );
    }
}

export default Game;