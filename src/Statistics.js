import React from 'react';
import db from './firebase'
import { doc, getDoc, getDocs, collection, query, orderBy, limit, where } from "firebase/firestore";

class Statistics extends React.Component {
    constructor(props) {
        super(props)
        let solved = this.props.solved;
        let currState = this.props.currState
        let times = []
        let todaysPuzzle = currState.id
        for (let i = 0; i < solved; i++) {
            times.push(currState.game[i].solvedTime)
        }
        this.state = {
            solved: solved,
            playerTimes: times,
            bestTime: null,
            worstTime: null,
            percent: 5,
            puzzleId: todaysPuzzle
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

        const countQuery = query(puzzleCollection);
        const countData = await getDocs(countQuery);
        let totalPlays = countData.docs.length;

        const countAboveQuery = query(puzzleCollection, where('solvedTime', '<', this.state.playerTimes[0]));
        const countAboveData = await getDocs(countAboveQuery);
        let betterTimes = countAboveData.docs.length;
        let percent = betterTimes / totalPlays * 100.0;
        state.percent = percent;
    }
    
    render() {
        return (
        <div>
            <p>Your time was {this.state.playerTimes[0]}</p>
            <p>Best time was {this.state.bestTime}</p>
            <p>Worst time was {this.state.worstTime}</p>
            <p>You are in the top {this.state.percent}%</p>
        </div>
        );
    }
}

export default Statistics;