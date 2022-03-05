// React
import React from 'react';

// Components
import Title from './Title'
import { ClockIcon, LockClosedIcon } from '@heroicons/react/solid'

// Utils
import { formatTime } from './utils/utils';

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
      cryptic: this.props.cryptic,
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

  toggleInputAnimation() {
    let prevState = this.state;
    prevState.animateInput = !prevState.animateInput;
    this.setState(prevState);
  }

  render() {
      return (
        <div>
          <Title cryptic={this.state.cryptic} title={this.props.title} />
          <div className="flex justify-center">
            {this.state.started
              ? <div className='mt-2'>
                  <div className="text-center white-space-nowrap">{this.props.puzzle.trio[0]} / {this.props.puzzle.trio[1]} / {this.props.puzzle.trio[2]}</div>
                  <div className="flex justify-center">
                    <input
                      disabled={this.props.solvedTime}
                      defaultValue={this.props.solvedTime ? this.props.puzzle.answer : ''}
                      className={this.state.animateInput ? "indent-1 outline-none border-2 bg-inherit rounded dark:bg-black animate-wiggle border-red-700"
                                                        : "indent-1 outline-none border-2 bg-inherit rounded dark:bg-black border-black dark:border-white"}
                      onAnimationEnd={() => this.toggleInputAnimation()} 
                      onKeyPress={this.attemptSolve}
                    />
                  </div>
                  
                  <div className="flex flex-row items-center justify-center">  
                    <ClockIcon className="h-7 w-7 m-1 text-center"/>
                    <div className="">{formatTime(this.state.secondsPast)}</div>
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

export default Puzzle;