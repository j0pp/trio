import React from 'react';

class SuggestionForm extends React.Component {

  render() {
      return (
        <div>
          <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
            Have a good idea for a potential Trio? Submit it here!
          </p>
          <form 
            name="trio-suggestion" 
            method="POST" 
            data-netlify="true" 
          >
            <input type="hidden" name="form-name" value="trio-suggestion" />
            <p>
              Name
            </p>
            <p>
              <input 
                className='indent-1 outline-none border-2 bg-inherit rounded dark:bg-black border-black dark:border-white'
                type="text"
                name="name"
                required
              />
            </p>

            <p className='mt-2'>
              Trio
            </p>
            <p>
              <input 
                className='indent-1 outline-none border-2 bg-inherit rounded dark:bg-black border-black dark:border-white'
                type="text"
                name="trio"
                required
              />
            </p>

            <p className='mt-2'>
              Answer
            </p>
            <p>
              <input 
                className='indent-1 outline-none border-2 bg-inherit rounded dark:bg-black border-black dark:border-white'
                type="text"
                name="answer"
                required
              />
            </p>
            
            <p className='mt-3'>
              Contact Information (optional)
            </p>
            <p>
              <textarea 
                className='w-1/2 h-36 indent-1 outline-none border-2 bg-inherit rounded dark:bg-black border-black dark:border-white'
                name="contact"
                placeholder='Social media or other link that will be posted if your Trio is used.'
              ></textarea>
            </p>
            <p>
              <button
                className='className="transform bg-green-700 hover:bg-green-900 transition duration-300 hover:scale-125 font-mono text-white rounded-lg p-3 mt-2 text-center'
                type="submit"
              >
                Submit
              </button>
            </p>
          </form>
        </div>
      );
    
  }
}

export default SuggestionForm;