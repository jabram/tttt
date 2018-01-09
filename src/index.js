import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={`square ${props.highlight ? 'highlight' : ''}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const highlight = this.props.winningSquares.indexOf(i) >= 0 ? true : false;
    return (
      <Square
        key={'square' + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={highlight}
      />
    );
  }

  render() {
    let squareNumber = 0;
    let rows = [];

    // loop through rows specified in Board props
    for (let row = 0; row < this.props.rows; row++) {
      let cols = [];

      // loop through cols specified in Board props
      for (let col = 0; col < this.props.cols; col++) {
        cols.push(
          this.renderSquare(squareNumber)
        )
        squareNumber++;
      }

      // builds each row using cols content
      rows.push(
        <div className="board-row" key={'row' + row}>
          {cols}
        </div>
      )
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      descOrder: false,
      history: [{
        squares: Array(9).fill(null),
        updatedSquare: null
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  toggleSort() {
    this.setState({
      descOrder: !this.state.descOrder
    })
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        updatedSquare: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    if (this.state.descOrder === true) {
      history.reverse();
    }

    // step = this iteration of the history array
    // move = current index of .map()
    const moves = history.map((step, iteration) => {
      const move = this.state.descOrder === true ? history.length - 1 - iteration : iteration;
      const position = calculateSquarePosition(history[iteration].updatedSquare);
      const desc = move ?
        'Go to move #' + move + ' (col ' + position.col + ', row ' + position.row + ')' :
        'Go to game start';
      return (
        <li key={move}>
          <button
            className={move === this.state.stepNumber ? 'bold' : ''}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    let winningSquares = [];
    if (winner) {
      status = 'Winner: ' + winner.player;
      winningSquares = winner.squares;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            rows={3}
            cols={3}
            squares={current.squares}
            winningSquares={winningSquares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            sort: {this.state.descOrder === true ? 'desc ' : 'asc '}
            <button onClick={() => this.toggleSort()}>change</button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


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
      return {
        player: squares[a],
        squares: lines[i]
      }
    }
  }
  return null;
}


function getColumnNumber(index) {
  return (index % 3) + 1;
}

function getRowNumber(index) {
  return Math.ceil((index + 1) / 3);
}

function calculateSquarePosition(index) {
  return {
    col: getColumnNumber(index),
    row: getRowNumber(index)
  }
}
