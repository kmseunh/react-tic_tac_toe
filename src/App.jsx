import { useState } from 'react';

// Square 컴포넌트: 각각의 게임 보드 칸을 렌더링
function Square({ value, onSquareClick }) {
    return (
        <button className='square' onClick={onSquareClick}>
            {value}
        </button>
    );
}

// calculateWinner 함수: 승자를 결정하는 로직
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
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    return null;
}
// Board 컴포넌트: 게임 보드 전체를 렌더링
function Board({ xIsNext, squares, onPlay }) {
    // handleClick 함수: 각 Square를 클릭했을 때의 동작 정의
    // 클릭한 Square가 이미 채워져 있거나 승자가 결정된 경우 무시합니다.
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        const nextSquares = squares.slice(); // 현재 보드 복사
        nextSquares[i] = xIsNext ? 'X' : 'O';
        onPlay(nextSquares); // 변경된 보드 상태를 전달
    }

    // 게임의 현재 상태(승자 또는 다음 플레이어)를 표시
    // 승자가 있으면 해당 플레이어를, 아니면 다음 플레이어 표시
    const winner = calculateWinner(squares);
    const status = winner
        ? `Winner: ${winner}`
        : `Next player: ${xIsNext ? 'X' : 'O'}`;

    const renderSquare = (i) => (
        <Square value={squares[i]} onClick={() => handleClick(i)} />
    );

    // 보드 UI를 렌더링
    // 3x3 칸의 Square로 구성되어 있습니다.
    return (
        <>
            <div className='status'>{status}</div>
            <div className='board-row'>
                <Square
                    value={squares[0]}
                    onSquareClick={() => handleClick(0)}
                />
                <Square
                    value={squares[1]}
                    onSquareClick={() => handleClick(1)}
                />
                <Square
                    value={squares[2]}
                    onSquareClick={() => handleClick(2)}
                />
            </div>
            <div className='board-row'>
                <Square
                    value={squares[3]}
                    onSquareClick={() => handleClick(3)}
                />
                <Square
                    value={squares[4]}
                    onSquareClick={() => handleClick(4)}
                />
                <Square
                    value={squares[5]}
                    onSquareClick={() => handleClick(5)}
                />
            </div>
            <div className='board-row'>
                <Square
                    value={squares[6]}
                    onSquareClick={() => handleClick(6)}
                />
                <Square
                    value={squares[7]}
                    onSquareClick={() => handleClick(7)}
                />
                <Square
                    value={squares[8]}
                    onSquareClick={() => handleClick(8)}
                />
            </div>
        </>
    );
}

// Game 컴포넌트: 게임의 상태와 이력을 관리하고 UI를 조합
export default function Game() {
    const [xIsNext, setXIsNext] = useState(true); // 다음 플레이어 상태 관리
    const [history, setHistory] = useState([Array(9).fill(null)]); // 이력 관리
    const [currentMove, setCurrentMove] = useState(0); // 현재 이동 관리
    const currentSquares = history[currentMove]; // 현재 보드 상태

    // handlePlay 함수: 플레이어의 움직임을 처리하고 이력을 업데이트
    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setXIsNext(!xIsNext);
    }

    // jumpTo 함수: 이전 이력으로 돌아가는 기능
    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
        setXIsNext(nextMove % 2 === 0);
    }

    // 이력을 바탕으로 각 움직임을 나타내는 버튼들을 렌더링
    const moves = history.map((squares, move) => (
        <li key={move}>
            <button onClick={() => jumpTo(move)}>
                {move ? `Go to move #${move}` : `Go to game start`}
            </button>
        </li>
    ));

    // 전체 게임 UI 렌더링
    return (
        <div className='game'>
            <div className='game-board'>
                <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                />
            </div>
            <div className='game-info'>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}
