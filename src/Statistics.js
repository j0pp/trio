import React from 'react';
import db from './firebase'
import { getDocs, collection, query, orderBy, limit, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import Chart from 'react-apexcharts';

class Statistics extends React.Component {
    constructor(props) {
        super(props)
        let currState = this.props.currState
        let times = []
        let todaysPuzzle = currState.id
        for (let i = 0; i < 3; i++) {
            times.push(currState.game[i].solvedTime)
        }
        this.state = {
            playerTimes: times,
            loaded: false,
            bestTime: null,
            worstTime: null,
            percent: 5,
            puzzleId: todaysPuzzle,
            series: [
                {
                  name: 'box',
                  type: 'boxPlot',
                  data: [
                    {
                      x: 'Easy',
                      y: []
                    }
                  ]
                }
              ],
              options: {
                chart: {
                  type: 'boxPlot',
                  height: 350
                },
                colors: ['#008FFB', '#FEB019'],
                title: {
                  text: 'Horizontal BoxPlot Chart',
                  align: 'left'
                },
                plotOptions: {
                  bar: {
                    horizontal: true,
                    barHeight: '50%'
                  }
                },
                xaxis: {
                    type: 'string'
                  },
                yaxis: {
                    type: 'numeric'
                }
              },
        }
    }

    async componentDidMount() {
        let state = this.state
        const difficulties = ['easy', 'medium', 'hard']
        const puzzleCollection = collection(db, 'puzzles/' + this.state.puzzleId + difficulties[0] + '/players');
        const worstQuery = query(puzzleCollection, orderBy("solvedTime", "desc"), limit(1));
        const worstData = await getDocs(worstQuery);
        let worstTime = worstData.docs[0].data().solvedTime;
        state.worstTime = worstTime

        const bestQuery = query(puzzleCollection, orderBy("solvedTime", "asc"), limit(1));
        const bestData = await getDocs(bestQuery);
        let bestTime = bestData.docs[0].data().solvedTime;
        state.bestTime = bestTime

        const allQuery = query(puzzleCollection);
        const allData = await getDocs(allQuery);
        let totalPlays = allData.docs.length;
        let times = []
        allData.forEach((doc) => {
            times.push(doc.data().solvedTime);
        });
        state.series[0].data[0].y = times
        state.loaded = true;

        const countAboveQuery = query(puzzleCollection, where('solvedTime', '<', this.state.playerTimes[0]));
        const countAboveData = await getDocs(countAboveQuery);
        let betterTimes = countAboveData.docs.length;
        let percent = betterTimes / totalPlays * 100.0;
        state.percent = percent;
        this.setState(state)
    }
    
    render() {
        return (
        <div className='w-screen h-28 mx-auto px-5 font-mono mt-4 md:w-1/2 text-center'>
            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                Statistics:
            </p>
            <div hidden={this.state.playerTimes[0] == null}>
                <p>Your time was {this.state.playerTimes[0]}</p>
                <p>Best time was {this.state.bestTime}</p>
                <p>Worst time was {this.state.worstTime}</p>
                <p>You are in the top {this.state.percent}%</p>
                {this.state.loaded ? <Chart options={this.state.options} series={this.state.series} type="boxPlot" height={350} /> : <p>loading...</p>}
                
            </div>
            <div hidden={this.state.playerTimes[0] != null}>
                <p>Finish a puzzle to get your stats!</p>
            </div>
            <Link to="/game">
            <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
            >
                Back to game
            </button>
            </Link>
            
        </div>
        );
    }
}

export default Statistics;
