import React from 'react';
import db from './firebase'
import { getDocs, collection, query } from "firebase/firestore";
import { Link } from "react-router-dom";
import Chart from 'react-apexcharts';
import apexchart from 'apexcharts';
// Utils
import { formatTime } from './utils/utils';

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
            leaderboard: null,
            loaded: false,
            enoughData: false,
            bestTime: null,
            worstTime: null,
            percent: 5,
            puzzleId: todaysPuzzle,
            theme: this.props.theme,
            series: [
                {
                  name: 'everyone else',
                  type: 'boxPlot',
                  data: []
                },
                {
                  name: 'you',
                  type: 'scatter',
                  data: []
                }
              ],
            options: {
              chart: {
                type: 'boxPlot',
                height: 350,
                background: 'none',
                id: 'chart'
              },
              colors: ['#008FFB', '#FEB019'],
              title: {
                text: 'Horizontal BoxPlot Chart',
                align: 'left'
              },
              xaxis: {
                type: 'string'
              },
              yaxis: {
                type: 'numeric',
                title: {
                  text: 'Solved Time'
                },
                labels: {
                  formatter: (value) => { return formatTime(value) }
                }
              },
              tooltip: {
                shared: false,
                intersect: true
              },
              theme: {
                mode: 'light'
              }
            },
        }
    }

    async componentDidMount() {
      let state = this.state
      const difficulties = ['easy', 'medium', 'hard']
      let timesJson = [];
      for (let i = 0; i < 3; i++) {
        if (this.state.playerTimes[i] != null) {
          state.series[1].data[i] = { x: difficulties[i].charAt(0).toUpperCase() + difficulties[i].slice(1), y: [state.playerTimes[i]] };
          state.series[0].data[i] = { x: difficulties[i].charAt(0).toUpperCase() + difficulties[i].slice(1), y: [] };
          const puzzleCollection = collection(db, 'puzzles/' + this.state.puzzleId + difficulties[i] + '/players');
          const allQuery = query(puzzleCollection);
          const allData = await getDocs(allQuery);
          let times = []
          allData.forEach((doc) => {
            times.push(doc.data().solvedTime);
            // for leaderboard
            if (timesJson.hasOwnProperty(doc.id)) {
              timesJson[doc.id]['times'].push(doc.data().solvedTime);
              timesJson[doc.id]['name']= doc.data().name;
            } else {
              timesJson[doc.id] = { times:[doc.data().solvedTime], name: doc.data().name };
            }
          });
          times.sort(function(a, b){return a-b});
          if (times.length >= 5) {
            if (state.series[0].data[i]) {
              state.series[0].data[i] = { x: difficulties[i].charAt(0).toUpperCase() + difficulties[i].slice(1), y: times };
            } else {
              state.series[0].data.push({ x: difficulties[i].charAt(0).toUpperCase() + difficulties[i].slice(1), y: times });
            }
            state.enoughData = true;
          }
        }
      }
      let timesArr = Object.keys(timesJson).map((key) => timesJson[key]);
      timesArr = timesArr.filter((player) => player['times'].length === 3);
      timesArr.sort(function(a, b){return a['times'].reduce((t1, t2) => t1 + t2, 0) - b['times'].reduce((t1, t2) => t1 + t2, 0)});
      console.log(timesArr[0]['times'].reduce((t1, t2) => t1 + t2, 0))
      state.leaderboard = timesArr.slice(0, 5);
      state.loaded = true;
      // Handle dark mode
      if (document.documentElement.classList.contains('dark')) {
        state.options.theme.mode = 'dark';
        state.options.chart.background = 'black';
      } else {
        state.options.theme.mode = 'light';
        state.options.chart.background = 'none';
      }
      this.setState(state);
      /*
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
      console.log(times)

      const countAboveQuery = query(puzzleCollection, where('solvedTime', '<', this.state.playerTimes[0]));
      const countAboveData = await getDocs(countAboveQuery);
      let betterTimes = countAboveData.docs.length;
      let percent = betterTimes / totalPlays * 100.0;
      state.percent = percent;
      */
    }
    
    render() {
        return (
        <div className='w-screen h-28 mx-auto px-5 font-mono mt-4 md:w-1/2 text-center'>
            <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                Statistics:
            </p>
            {this.state.leaderboard &&
              <div>
                <p>Leaderboard:</p>
                <div>
                {this.state.leaderboard.map((player, index) => (
                  <p key={index}>{player['name'] === '' ? index + 1 : player['name']}. {formatTime(player['times'].reduce((t1, t2) => t1 + t2, 0))}</p>
                ))}
                </div>
              </div>
            }
            <div hidden={this.state.playerTimes[0] == null}>
              {this.state.enoughData ? this.state.loaded ? <Chart options={this.state.options} series={this.state.series} type="boxPlot" height={350} /> : <p>loading...</p> : <p>not enough data</p>}
            </div>
            <div hidden={this.state.playerTimes[0] != null}>
                <p>Finish a puzzle to get your stats!</p>
            </div>
        </div>
        );
    }
}

export default Statistics;
