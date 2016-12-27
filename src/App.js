import React, {Component} from 'react';
import './App.css';

class Game extends Component {

  constructor(props)
  {
    super(props);
    //Constant variables for directions
    this.UP = 0;
    this.DOWN = 1;
    this.LEFT = 2;
    this.RIGHT = 3;
    //binding methods
    this.updateCellArr = this.updateCellArr.bind(this);
    this.getNewRandAttachedArr = this.getNewRandAttachedArr.bind(this);
    this.getMergedArray = this.getMergedArray.bind(this);
    this.genTileNum = this.genTileNum.bind(this);
    this.keyHandler = this.keyHandler.bind(this);
    this.printArr = this.printArr.bind(this);

    //addedArr is used by render function to show which entry has been newly created
    this.addedArr = Array(16).fill(null);
    //generating an initial array to be assigned to cellNums and history objects
    var initialArr = Array(16).fill(null);
    for (let i = 0; i < 2; i++)
    {
      initialArr = this.getNewRandAttachedArr(initialArr);
    }
    //set this.state
    this.state = {
      cellNums: initialArr,
      highest: 0,
      current: 0,
      history: [initialArr]
    };
    //register key event
    window.onkeydown = this.keyHandler;
  }

  keyHandler(event)
  {
    let currentArr = this.state.cellNums;
    let transformedArr;
    let hit = false;
    switch (event.which)
    {
      case 38:
      case 87:
        transformedArr = this.getMergedArray(currentArr, this.UP);
        hit = true;
        break;
      case 39:
      case 68:
        transformedArr = this.getMergedArray(currentArr, this.RIGHT);
        hit = true;
        break;
      case 37:
      case 65:
        transformedArr = this.getMergedArray(currentArr, this.LEFT);
        hit = true;
        break;
      case 40:
      case 83:
        transformedArr = this.getMergedArray(currentArr, this.DOWN);
        hit = true;
        break;
      default:
        transformedArr = null;
    }
    if (hit)
    {
      transformedArr = this.getNewRandAttachedArr(transformedArr);
      if (transformedArr)
      {
        this.updateCellArr(transformedArr);
      }
    }
  }

  printArr(arr)
  {
    let currentArr = arr;
    var appendStr = '';
    for (let row = 0; row < 4; row++)
    {
      for (let i = 0; i < 4; i++)
      {
        appendStr += currentArr[row * 4 + i] + '\t';
      }
      appendStr += '\n';
    }
    return appendStr;
  }

  render()
  {
    this.printArr(this.addedArr);
    return (<div className="game-wrapper">
      <GameInfo highest={this.state.highest} current={this.state.current}/>
      <GameGrid cellNums={this.state.cellNums} addedArr={this.addedArr} onKeyDown={this.keyHandler}/>
    </div>);
  }

  getMergedArray(currentArr, dir)
  {
    var arrCpy = currentArr.slice();
    //A map of the same size as arrCpy to denote which number on the same index has been merged and which has not;
    //if the number at the corresponding index has been merged then we cannot merge it again
    //All entries initialized to false to indicated all elements are mergeable at first
    var nonMergeableMap = Array(arrCpy.length).fill(false);

    var i = (dir === this.UP || dir === this.LEFT) ? 0 : arrCpy.length - 1;
    const increment = (dir === this.UP || dir === this.LEFT) ? 1 : -1;
    while ((dir === this.UP || dir === this.LEFT) ? i < arrCpy.length : i >= 0)
    {
      let currentIndex = i;
      i += increment;

      //If there are no numbers on current position then go to next position
      if (!arrCpy[currentIndex])
      {continue;}

      //The element at the same column but on a previous row
      let mergeTargetIndex = this.getFirstNotNullIndexInDir(arrCpy, currentIndex, dir);

      //If there are nothing to merge in the move direction,
      // or if the merge target has been merged once, or the element on current index is not equal to target index,
      // then shift current position to as far as it can in the move direction. There is nothing to do with merge
      // target obtained above
      if (mergeTargetIndex < 0 || nonMergeableMap[mergeTargetIndex] || !this.isEqual(arrCpy, currentIndex, mergeTargetIndex))
      {
        this.shiftTo(arrCpy, currentIndex, this.getFarthestFreeMoveIndexInDir(arrCpy, currentIndex, dir));
      } else
      {
        //arrCpy[mergeDestIndex] must be null
        let mergeDestIndex = this.getFarthestFreeMoveIndexInDir(arrCpy, mergeTargetIndex, dir);
        let num1 = arrCpy[currentIndex];
        let num2 = arrCpy[mergeTargetIndex];
        //mutating the array
        arrCpy[mergeDestIndex] = num1 + num2;

        //mergeDestIndex may be equal to currentIndex or mergeTargetIndex
        if (mergeDestIndex !== currentIndex)
        {
          arrCpy[currentIndex] = null;
        }
        if (mergeDestIndex !== mergeTargetIndex)
        {
          arrCpy[mergeTargetIndex] = null;
        }
        //Number in mergeDestIndex has been merged once, so update the corresponding position in nonMergeableMap
        nonMergeableMap[mergeDestIndex] = true;
      }
    }//loop ends
    //Update addedArr
    this.addedArr = nonMergeableMap;
    return arrCpy;
  }

  isEqual(arr, index1, index2)
  {
    return arr[index1] === arr[index2];
  }

  getFarthestFreeMoveIndexInDir(arr, index, dir)
  {
    var i;
    switch (dir)
    {
      case this.UP:
        for (i = index - 4; i >= 0; i -= 4)
        {
          if (arr[i])
          {
            return i + 4;
          }
        }
        return index % 4;
      case this.DOWN:
        for (i = index + 4; i < arr.length; i += 4)
        {
          if (arr[i])
          {
            return i - 4;
          }
        }
        return index % 4 + 12;
      case this.LEFT:
        for (i = index - 1; i >= Math.floor(index / 4) * 4; i--)
        {
          if (arr[i])
          {
            return i + 1;
          }
        }
        return Math.floor(index / 4) * 4;
      case this.RIGHT:
        for (i = index + 1; i < Math.floor(index / 4) * 4 + 4; i++)
        {
          if (arr[i])
          {
            return i - 1;
          }
        }
        return Math.floor(index / 4) * 4 + 3;
      default:
        return index;
    }
  }

  shiftTo(arr, currentIndex, targetindex)
  {
    //currentIndex may be equal to targetIndex due to the return values of other methods
    if (currentIndex !== targetindex)
    {
      arr[targetindex] = arr[currentIndex];
      arr[currentIndex] = null;
    }
  }

  getFirstNotNullIndexInDir(arr, index, dir)
  {
    switch (dir)
    {
      case this.UP:
        for (let i = index - 4; i >= 0; i -= 4)
        {
          if (arr[i])
          {
            return i;
          }
        }
        break;
      case this.DOWN:
        for (let i = index + 4; i < arr.length; i += 4)
        {
          if (arr[i])
          {
            return i;
          }
        }
        break;
      case this.LEFT:
        for (let i = index - 1; i >= Math.floor(index / 4) * 4; i--)
        {
          if (arr[i])
          {
            return i;
          }
        }
        break;
      case this.RIGHT:
        for (let i = index + 1; i < Math.floor(index / 4) * 4 + 4; i++)
        {
          if (arr[i])
          {
            return i;
          }
        }
        break;
      default:
        return -1;
    }
    return -1;
  }

  /**
   * Shorthand method to update history and current arr in the state object. Used in conjunction with getNewRandAttachedArr
   * Should not be used in constructor, only used in onKeyPressed events
   * Example: this.updateCellArr(this.getNewRandAttachedArr(this.state.cellNums))
   * @param cellArr
   */
  updateCellArr(cellArr)
  {
    let histTempArr = this.state.history;
    this.setState({
      cellNums: cellArr,
      history: histTempArr.concat([cellArr])
    });
  }

  /**
   * Use this method to add get a new array that contains an extra number of 2 or 4 randomly assigned to
   * the blank positions in the old array
   * @param cellArr old number array
   * @return a new array with newly randomly added number
   */
  getNewRandAttachedArr(cellArr)
  {
    var arrCpy = cellArr.slice();
    //record array that contains the indices of empty entries in cellArr
    var indexArr = [];
    arrCpy.forEach(function (num, index)
    {
      //if num is null. then its index is added to the record array indexArr
      if (!num)
      {
        indexArr.push(index);
      }
    });
    //Decide on which empty slot in cellArr to add the new random value
    var randomIndexInIndexArr = Math.floor(Math.random() * indexArr.length);
    arrCpy[indexArr[randomIndexInIndexArr]] = this.genTileNum();
    this.addedArr[indexArr[randomIndexInIndexArr]] = true;
    return arrCpy;
  }

  /**
   * Get a number of 2 or 4
   * @returns {*|T} 2 90% of the time
   *                  4 10% of the time
   */
  genTileNum()
  {
    if (Math.random() > 0.9)
    {
      return 4;
    }
    return 2;
  }
}

class GameInfo extends Component {

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

  renderCell(index, num, isNewlyAdded)
  {
    return <div key={'cell-' + index} className={isNewlyAdded ? "game-cell game-cell-new" : "game-cell"}><span
      className={"game-number num-" + num}>{num}</span>
    </div>
  }

  render()
  {
    var newlyAddedEntryArr = this.props.addedArr;
    var rows = [];
    for (let i = 0; i < 4; i++)
    {
      let cells = [];
      for (let j = 0; j < 4; j++)
      {
        let currentRenderingIndex = i * 4 + j;
        cells.push(this.renderCell(currentRenderingIndex, this.props.cellNums[currentRenderingIndex], newlyAddedEntryArr[currentRenderingIndex]));
      }
      rows.push(<div className="game-row" key={"row-" + i}>{cells}</div>);
    }
    return (
      <div className="game-grid" onKeyDown={this.props.onKeyDown}>
        {rows}
      </div>
    );
  }
}
export default Game;