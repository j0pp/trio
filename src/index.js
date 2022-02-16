import React from 'react';
import ReactDOM from 'react-dom';
import { ChartBarIcon, QuestionMarkCircleIcon, MoonIcon, ClockIcon, LockClosedIcon } from '@heroicons/react/solid'
import './index.css';

class Puzzle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      started: false,
      timeStarted: null,
      animateInput: false,
      secondsPast: 0,
      interval: null,
    }
  }

  startPuzzle() {
    console.log('start')
    let clock = setInterval(this.updateTime, 1000);
    this.setState({started: true, timeStarted: new Date().getTime(), interval: clock});
    
  }

  updateTime = () => {
    let prevState = this.state;
    prevState.secondsPast += 1;
    this.setState(prevState);
  }

  attemptSolve = (event) => {
    if (event.key === 'Enter'){
      if (event.target.value.toLowerCase() === this.props.puzzle.answer) {
        this.props.onSolve();
        clearInterval(this.state.interval);
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
                  <div className="text-center">{this.props.puzzle.trio[0]} / {this.props.puzzle.trio[1]} / {this.props.puzzle.trio[2]}</div>
                  <input
                    disabled={this.props.puzzle.solved}
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
    this.state = {
      puzzles: [{trio: ['aid', 'rubber', 'wagon'], answer: 'band', solved: false}, 
                {trio: ['fox', 'man', 'peep'], answer: 'hole', solved: false},
                {trio: ['home', 'sea', 'bed'], answer: 'sick', solved: false},],
    }
  }

  enableStart(i) {
    if (i === 0) {
      return true;
    } else {
      return this.state.puzzles[i - 1].solved;
    }
  }

  puzzleSolved(i) {
    const state = this.state;
    state.puzzles[i].solved = true;
    this.setState(state);
  }

  handleDarkMode() {
    if (localStorage.theme === 'dark') {
      console.log('changing to dark')
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    } else {
      console.log('changing to light')
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    }
  }

  render() {
    return (
      <div className="bg-yellow-50 w-screen h-screen dark:bg-black text-black dark:text-yellow-50">
        <div className="flex justify-center font-mono text-7xl pt-3 font-bold">
          Trio
        </div>
        <div className="flex justify-center font-mono font-bold">
          <QuestionMarkCircleIcon className="h-7 w-7 mx-3 cursor-pointer"/>
          <ChartBarIcon className="h-7 w-7 mx-3 cursor-pointer"/>
          <MoonIcon onClick={() => this.handleDarkMode()} className="h-7 w-7 mx-3 cursor-pointer"/>
        </div>
        <div className="flex justify-center font-mono font-italic font-bold mt-5">
          Puzzle #46
        </div>
        <div className="w-1/2 h-28 mx-auto font-mono mt-4">
          <Puzzle
            title='Easy'
            puzzle={this.state.puzzles[0]}
            onSolve={() => this.puzzleSolved(0)}
            enableStart={() => this.enableStart(0)}
          />
        </div>
        <div className="w-1/2 h-28 mx-auto font-mono mt-2">
          <Puzzle
            title='Medium'
            puzzle={this.state.puzzles[1]}
            onSolve={() => this.puzzleSolved(1)}
            enableStart={() => this.enableStart(1)}
          />
        </div>
        <div className="w-1/2 h-28 mx-auto font-mono mt-2">
          <Puzzle
            title='Hard'
            puzzle={this.state.puzzles[2]}
            onSolve={() => this.puzzleSolved(2)}
            enableStart={() => this.enableStart(2)}
          />
        </div>
          {/* <div>Easy</div>
          <div>Medium</div>
          <div>Hard</div> */}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
