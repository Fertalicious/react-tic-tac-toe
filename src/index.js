import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={()=>this.props.onClick(i)}
      />);
  }

  renderBoard(bs){
    /*
    <div className="board-row">
    while(index < bs){
      this.renderSquare(index);
      index++;
    }
    </div>
    */
    //const boardSize = 3;
    var index = 0;
    let rowNumber = 3;
    let rows = [];
    let freshBoard = [];
    for(var i = 0; i < bs; i++){
      while(index < rowNumber){
        rows.push(this.renderSquare(index));
        index++;
      }
      freshBoard.push(<div key={i} className="board-row">{rows}</div>);
      rows = [];
      rowNumber += 3;
      //rows = [];
    }
    return(
      freshBoard
    );
  }
  /*
    <div className="board-row">
      {this.renderSquare(0)}
      {this.renderSquare(1)}
      {this.renderSquare(2)}
    </div>
    <div className="board-row">
      {this.renderSquare(3)}
      {this.renderSquare(4)}
      {this.renderSquare(5)}
    </div>
    <div className="board-row">
      {this.renderSquare(6)}
      {this.renderSquare(7)}
      {this.renderSquare(8)}
    </div>
    */
  render() {
    return (
      <div>
      {this.renderBoard(3)}

      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(0).fill(null),
        coord: 0,
        btnClass: 'normal-btn'
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  jumpTo(step, move){
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) === 0,
    });
    this.state.history.forEach(function(historyStep) {
      historyStep.btnClass = 'normal-btn';
    });
    step.btnClass = 'bold-btn';
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        coord: i,
        btnClass: 'normal-btn'
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });

  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' ' + step.coord :
        'Go to game start';
      return (
        <li key={move}>
          <button className={step.btnClass} onClick={()=>this.jumpTo(step, move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if(winner){
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
