import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class Game extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      cellNums: Array(16).fill(null),
      highest: 0,
      current: 0,
      history: []
    }
    this.updateCellArr = this.updateCellArr().bind(this);
  }

  render()
  {
    return (<div className="game-wrapper">
      <GameInfo highest={this.state.highest} current={this.state.current}/>
      <GameGrid cellNums{this.state.cellNums} onKeyPress={this.keyHandler}/>
    </div>);
  }

  keyHandler(event){

  }

  updateCellArr(cellArr)
  {
    this.setState({
      cellNums: cellArr
    });
  }
}

class GameInfo extends Component {
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (
      <div className="game-upper">
        <h1 className="game-title">2048</h1>
        <div className="game-control">
          <div className="score-tab">
            <h3 className="score-tab-title">BEST</h3>
            <div className="score-num">{this.props.highest}</div>
          </div>
          <div className="score-tab">
            <h3 className="score-tab-title">SCORE</h3>
            <div className="score-num">{this.props.current}</div>
          </div>
        </div>
      </div>
    );
  }
}

class GameGrid extends Component {
  constructor(props)
  {
    super(props);
  }

  render()
  {

  }
}

export default Game;