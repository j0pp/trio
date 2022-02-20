import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/outline'
import ReactTooltip from 'react-tooltip'

class Title extends React.Component {

  render() {
    if (this.props.cryptic) {
      return (
        <div className='flex flex-row justify-center items-center'>
          <div
            className='font-geo text-3xl italic'
          >
            CRYPTIC
          </div>
          <InformationCircleIcon
            className='w-4 h-4 ml-2 cursor-pointer'
            data-tip
            data-for='crypticInfo'
          />
          <ReactTooltip
            id='crypticInfo'
            effect='solid'
            className='bg-black text-yellow-50 dark:bg-yellow-50 dark:text-black'
          />
        </div>
        
      );
    } else {
      return (
        <div
          className='font-mono text-center'
        >
          Difficulty: {this.props.difficulty}
        </div>
      );
    }
    
  }
}

export default Title;