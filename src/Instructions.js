import React from 'react';
import {
  Link
} from "react-router-dom";

class Instructions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div
          className='w-screen h-28 mx-auto px-5 font-mono mt-4 md:w-1/2'
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
          
        </div>
    );
  }
}

export default Instructions;
