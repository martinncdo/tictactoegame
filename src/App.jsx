import { useState } from 'react';

function Square({ onSquareClick, value = null }) {
  return (
    <div className="square" onClick={onSquareClick}>
      {value}
    </div>
  );
}

function Board({ xIsNext, squares, onPlay, gameMode, count1, count2 }) {
  const [block, setBlock] = useState(false);
  
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    if (gameMode) {
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }
      onPlay(nextSquares);
    } else {
      if (!block) {
        const nextSquares = squares.slice();
        nextSquares[i] = 'X';
        onPlay(nextSquares);
        const squaresForMinimax = parseSquares(nextSquares);
        const result = minimax(squaresForMinimax, "O");
        setBlock(true);
        setTimeout(() => {
          nextSquares[result.index] = "O";
          onPlay(nextSquares);
          setBlock(false);
        }, 500);
      }
    }
  }

  function parseSquares(squares) {
    let copy = squares.map((el, i) => {
      if (el === null) {
        return i
      }else {
        return el
      }
    })
    return copy
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = 'Winner: ' + winner;
    setTimeout(() => {
      onPlay(Array(9).fill(null))
    }, 1000)
  } 

  if (gameMode === undefined) {
    return(
      <></>
    )
  }else if (gameMode === true || gameMode === false) {
    return (
      <>
      <div className="board-row">
          <div className='box-square reset-bottom reset-top reset-left'>
            <Square value={squares[0]} onSquareClick={() => handleClick(0, gameMode)} />
          </div>
          <div className='box-square reset-bottom reset-top reset-left reset-right'>
            <Square value={squares[1]} onSquareClick={() => handleClick(1, gameMode)} />
          </div>
          <div className='box-square reset-bottom reset-top reset-right'>
            <Square value={squares[2]} onSquareClick={() => handleClick(2, gameMode)} />
          </div>
      </div>
      <div className="board-row">
          <div className='box-square reset-bottom reset-left'>
            <Square value={squares[3]} onSquareClick={() => handleClick(3, gameMode)} />
            </div>
            <div className='box-square reset-bottom reset-left reset-right'>
            <Square value={squares[4]} onSquareClick={() => handleClick(4, gameMode)} />
          </div>
          <div className='box-square reset-bottom reset-right'>
            <Square value={squares[5]} onSquareClick={() => handleClick(5, gameMode)} />
          </div>
      </div>
        <div className="board-row">
          <div className='box-square reset-bottom reset-left'>
            <Square value={squares[6]} onSquareClick={() => handleClick(6, gameMode)} />
            </div>
            <div className='box-square reset-bottom reset-left reset-right'>
            <Square value={squares[7]} onSquareClick={() => handleClick(7, gameMode)} />
          </div>
          <div className='box-square reset-bottom reset-right'>
            <Square value={squares[8]} onSquareClick={() => handleClick(8, gameMode)} />
          </div>
        </div>
      </>
    )
  }
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [multiplayer, setMultiplayer] = useState(undefined);
  const [btnsVisible, setBtnsVisible] = useState(true);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    let winner = calculateWinner(nextSquares);
    console.log(winner);

    if (winner === "X") {
      let newcount = count1;
      setCount1(newcount + 1);
    }else if (winner === "O") {
      let newcount = count2;
      setCount2(newcount + 1);
    } else if (!winner && nextSquares[0] !== null && nextSquares[1] !== null && nextSquares[2] !== null && nextSquares[3] !== null && nextSquares[4] !== null && nextSquares[5] !== null && nextSquares[6] !== null && nextSquares[7] !== null && nextSquares[8] !== null) {
      setTimeout(() => {
        setHistory([Array(9).fill(null)]);
        setCurrentMove(0);
      }, 1000)
    }

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function changeGameMode(bool) {
    if (bool) {
      setMultiplayer(true);
    }else {
      setMultiplayer(false);
    }
    setBtnsVisible(false);
  }

  return (
    <div className="main">
      <div className="game">
        <div className="game-mode">
          {btnsVisible && (
            <div className='menu'>
              <h1>Tic Tac Toe</h1>
              <div className='option-game'>Elige el modo de juego</div>
              <div className='container-btns'>
                <button className="btn" onClick={() => changeGameMode(true)}>Multijugador 1 vs 1</button>
                <button className="btn" onClick={() => changeGameMode(false)}>Único jugador vs PC</button>
              </div>
            </div>
          )}
        </div>
          {!btnsVisible && (
          <div className='scores'>
              {multiplayer ? <div className='jugador1vjugador2'>
                <div className='jugador1'>
                  Jugador 1
                  <div>
                    {count1}
                  </div>
                </div>
                <div className='jugador2'>
                  Jugador 2
                  <div>
                    {count2}
                  </div>
                </div>
              </div> : 
              <div className='jugador1vpc'>
                <div className='jugador1'>
                  Jugador 1
                  <div>
                    {count1}
                  </div>
                </div>
                <div className='jugador2'>
                  PC
                  <div>
                    {count2}
                  </div>
                </div>
              </div>}
            
          </div>
          )}
          <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} gameMode={multiplayer} count1={count1} count2={count2}/>
          </div>
          {
            !btnsVisible && (
              <button className='btn-restart' onClick={() => {setBtnsVisible(true) 
                setMultiplayer(undefined)
                setHistory([Array(9).fill(null)])
                setCurrentMove(0)
                setCount1(0)
                setCount2(0)
              }}>Ir al menú</button>
            )
          }
      </div>
      {
        btnsVisible && (
          <div className='portada'></div>
        )
      }
    </div>
  );
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

function getAllEmptyCellsIndexes(currBdSt) {
  return currBdSt.filter(i => i != "O" && i != "X");
}

// Step 5 - Create a winner determiner function:
function checkIfWinnerFound(currBdSt, currMark) {
  if (
      (currBdSt[0] === currMark && currBdSt[1] === currMark && currBdSt[2] === currMark) ||
      (currBdSt[3] === currMark && currBdSt[4] === currMark && currBdSt[5] === currMark) ||
      (currBdSt[6] === currMark && currBdSt[7] === currMark && currBdSt[8] === currMark) ||
      (currBdSt[0] === currMark && currBdSt[3] === currMark && currBdSt[6] === currMark) ||
      (currBdSt[1] === currMark && currBdSt[4] === currMark && currBdSt[7] === currMark) ||
      (currBdSt[2] === currMark && currBdSt[5] === currMark && currBdSt[8] === currMark) ||
      (currBdSt[0] === currMark && currBdSt[4] === currMark && currBdSt[8] === currMark) ||
      (currBdSt[2] === currMark && currBdSt[4] === currMark && currBdSt[6] === currMark)
) {
      return true;
  } else {
      return false;
  }
}

function minimax(currBdSt, currMark) {
  // Step 8 - Store the indexes of all empty cells:
  const humanMark = "X";
  const aiMark = "O";
  const availCellsIndexes = getAllEmptyCellsIndexes(currBdSt);
  
  // Step 9 - Check if there is a terminal state:
  if (checkIfWinnerFound(currBdSt, humanMark)) {
      return {score: -1};
  } else if (checkIfWinnerFound(currBdSt, aiMark)) {
      return {score: 1};
  } else if (availCellsIndexes.length === 0) {
      return {score: 0};
  }
  
  // Step 10 - Create a place to record the outcome of each test drive:
  const allTestPlayInfos = [];
  
  // Step 10 - Create a for-loop statement that will loop through each of the empty cells:
  for (let i = 0; i < availCellsIndexes.length; i++) {
      // Step 11 - Create a place to store this test-play’s terminal score:
      const currentTestPlayInfo = {};
      
      // Step 11 - Save the index number of the cell this for-loop is currently processing:
      currentTestPlayInfo.index = currBdSt[availCellsIndexes[i]];
      
      // Step 11 - Place the current player’s mark on the cell for-loop is currently processing:
      currBdSt[availCellsIndexes[i]] = currMark;
      
      if (currMark === aiMark) {
          // Step 11 - Recursively run the minimax function for the new board:
          const result = minimax(currBdSt, humanMark);
          
          // Step 12 - Save the result variable’s score into the currentTestPlayInfo object:
          currentTestPlayInfo.score = result.score;
      } else {
          // Step 11 - Recursively run the minimax function for the new board:
          const result = minimax(currBdSt, aiMark);
          
          // Step 12 - Save the result variable’s score into the currentTestPlayInfo object:
          currentTestPlayInfo.score = result.score;
      }
      
      // Step 12 - Reset the current board back to the state it was before the current player made its move:
      currBdSt[availCellsIndexes[i]] = currentTestPlayInfo.index;
      
      // Step 12 - Save the result of the current player’s test-play for future use:
      allTestPlayInfos.push(currentTestPlayInfo);
  }
  
  // Step 15 - Create a store for the best test-play’s reference:
  let bestTestPlay = null;
  
  // Step 16 - Get the reference to the current player’s best test-play:
  if (currMark === aiMark) {
      let bestScore = -Infinity;
      for (let i = 0; i < allTestPlayInfos.length; i++) {
          if (allTestPlayInfos[i].score > bestScore) {
              bestScore = allTestPlayInfos[i].score;
              bestTestPlay = i;
          }
      }
  } else {
      let bestScore = Infinity;
      for (let i = 0; i < allTestPlayInfos.length; i++) {
          if (allTestPlayInfos[i].score < bestScore) {
              bestScore = allTestPlayInfos[i].score;
              bestTestPlay = i;
          }
      }
  }
  
  // Step 17 - Get the object with the best test-play score for the current player:
  return allTestPlayInfos[bestTestPlay];
} 

// Step 7 - First minimax invocation: