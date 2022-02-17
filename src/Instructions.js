import React from "react";
import { QuestionMarkCircleIcon } from '@heroicons/react/solid'
import './index.css';

export default function Instructions() {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <>
      <QuestionMarkCircleIcon
        className="h-7 w-7 mx-3 cursor-pointer"
        onClick={() => setShowModal(true)}
      />
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-yellow-50 dark:bg-neutral-900 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    How do you play Trio?
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    The game is simple and based on the <a className="text-blue-300" target="_blank" href="https://en.wikipedia.org/wiki/Remote_Associates_Test">Remote Associates Test</a>. You will be prompted with three different
                    words and a timer will start. For example, the words may be
                  </p>
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">cottage / swiss / cake</p>
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    Your job is to figure out the
                    word that is the 'missing link'. In this case, the answer is
                    <em> cheese</em> (<em>cottage </em>cheese, swiss <em> cheese</em>, and <em>cheese </em>cake).
                    The answer can be a prefix or suffix for each clue word.
                  </p>
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    There is no penalty for guessing, your final time is the only
                    thing that counts.
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}