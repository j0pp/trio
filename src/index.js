import React from 'react';
import ReactDOM from 'react-dom';
import { ChartBarIcon, QuestionMarkCircleIcon, MoonIcon, ClockIcon, LockClosedIcon } from '@heroicons/react/solid'
import './index.css';
import { puzzles } from './puzzles';

class Puzzle extends React.Component {
  constructor(props) {
    super(props)
    let startTime = this.props.startTime;
    let started = Boolean(startTime);
    let secondsPast = 0;
    if (started) {
      if (this.props.solvedTime) {
        secondsPast = this.props.solvedTime;
      } else {
        let now = new Date().getTime();
        secondsPast = Math.floor((now - startTime) / 1000);
      }
    }
    this.state = {
      started: started,
      timeStarted: startTime,
      animateInput: false,
      secondsPast: secondsPast,
      interval: null,
    }
  }

  componentDidMount() {
    if (this.state.started && !this.props.solvedTime) {
      this.startTimer();
    }
  }

  startPuzzle() {
    this.startTimer();
    let timeStarted = new Date().getTime();
    this.props.setStartedTime(timeStarted);
    let prevState = this.state;
    prevState.started = true;
    prevState.timeStarted = timeStarted;
    this.setState(prevState)
  }

  startTimer() {
    let clock = setInterval(this.updateTime, 1000);
    let prevState = this.state;
    prevState.interval = clock;
    this.setState(prevState);
  }

  stopTimer() {
    clearInterval(this.state.interval);
  }

  updateTime = () => {
    let prevState = this.state;
    prevState.secondsPast += 1;
    this.setState(prevState);
  }

  attemptSolve = (event) => {
    if (event.key === 'Enter'){
      if (event.target.value.toLowerCase() === this.props.puzzle.answer) {
        this.props.onSolve(this.state.secondsPast);
        this.stopTimer();
      } else {
        this.toggleInputAnimation();
        event.target.value = '';
      }
    }
  }

  formatTime = (seconds) => {
    let min = Math.floor(seconds / 60);
    let secs = seconds % 60;
    if (secs < 10) {
      return min + ':0' + secs;
    }
    return min + ':' + secs;
  }

  toggleInputAnimation() {
    let prevState = this.state;
    prevState.animateInput = !prevState.animateInput;
    this.setState(prevState);
  }

  render() {
      return (
        <div>
          <div className="text-center">Difficulty: {this.props.title}</div>
          <div className="flex justify-center">
            {this.state.started
              ? <div className='mt-2'>
                  <div className="text-center white-space-nowrap">{this.props.puzzle.trio[0]} / {this.props.puzzle.trio[1]} / {this.props.puzzle.trio[2]}</div>
                  <input
                    disabled={this.props.solvedTime}
                    defaultValue={this.props.solvedTime ? this.props.puzzle.answer : ''}
                    className={this.state.animateInput ? "indent-1 outline-none border-2 bg-inherit rounded dark:bg-black animate-wiggle border-red-700"
                                                       : "indent-1 outline-none border-2 bg-inherit rounded dark:bg-black border-black dark:border-white"}
                    onAnimationEnd={() => this.toggleInputAnimation()} 
                    onKeyPress={this.attemptSolve}
                  />
                  <div className="flex flex-row items-center justify-center">  
                    <ClockIcon className="h-7 w-7 m-1 text-center"/>
                    <div className="">{this.formatTime(this.state.secondsPast)}</div>
                  </div>
                </div>
              : this.props.enableStart()
                  ? <button
                      className="transform bg-green-700 hover:bg-green-900 transition duration-300 hover:scale-125 font-mono text-white rounded-lg p-3 m-5 text-center"
                      onClick={() => this.startPuzzle()}
                    >
                      GO!
                    </button>
                  : <button
                      className="flex justify-center bg-red-700 hover:bg-red-900 font-mono text-white rounded-lg p-3 m-5 text-center"
                    >
                      <LockClosedIcon className="h-5 w-5 text-center"/>Locked
                    </button>
                
            }
          </div>
            
          </div>
        
      );
    
  }
}

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
          <MoonIcon onClick={() => this.handleDarkMode()} className="h-7 w-7 mx-3 cursor-pointer"/>
        </div>
        <div
          className='w-screen h-28 mx-auto px-5 font-mono mt-4 md:w-1/2'
          hidden={this.state.page !== 0}
        >
          <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
            Trio is a simple game based on the <a className="text-blue-300" target="_blank" href="https://en.wikipedia.org/wiki/Remote_Associates_Test" rel="noreferrer">Remote Associates Test</a>. You will be prompted with three different
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
