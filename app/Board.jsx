"use client";
import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";

// Helper to check for M in a row
function checkWinner(board, m) {
  const n = board.length;
  const lines = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal down-right
    [1, -1], // diagonal down-left
  ];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const player = board[i][j];
      if (!player) continue;
      for (const [dx, dy] of lines) {
        let count = 1;
        let x = i + dx, y = j + dy;
        while (
          x >= 0 && x < n && y >= 0 && y < n &&
          board[x][y] === player
        ) {
          count++;
          if (count === m) return player;
          x += dx;
          y += dy;
        }
      }
    }
  }
  return null;
}

function isDraw(board) {
  return board.every(row => row.every(cell => cell));
}

const Board = forwardRef(function Board({ n = 3, m = 3, setStatus, borderColor, bgColor }, ref) {
  const [board, setBoard] = useState(Array.from({ length: n }, () => Array(n).fill(null)));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = checkWinner(board, m);
  const draw = !winner && isDraw(board);
  const [moveMade, setMoveMade] = useState(false);

  // Reset board when n changes
  useEffect(() => {
    setBoard(Array.from({ length: n }, () => Array(n).fill(null)));
    setXIsNext(true);
  }, [n]);

  // Expose reset method to parent
  useImperativeHandle(ref, () => ({
    resetBoard: () => {
      setBoard(Array.from({ length: n }, () => Array(n).fill(null)));
      setXIsNext(true);
    }
  }), [n]);

  // Update status in parent
  useEffect(() => {
    let status;
    if (winner) status = `Winner: ${winner}`;
    else if (draw) status = "Draw!";
    else status = `Next player: ${xIsNext ? "X" : "O"}`;
    setStatus && setStatus(status);
  }, [winner, draw, xIsNext, setStatus]);

  // Handle cell click
  const handleClick = (row, col) => {
    if (board[row][col] || winner) return;
    const newBoard = board.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? (xIsNext ? "X" : "O") : cell))
    );
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    if (!moveMade) setMoveMade(true);
  };

  // Responsive board size (fix hydration error)
  const [maxBoardPx, setMaxBoardPx] = useState(500); // Default for SSR
  const borderPadding = 12;
  useEffect(() => {
    function updateSize() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setMaxBoardPx(Math.min(vw * 0.9, vh * 0.7, 700) - borderPadding * 2);
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const cellSize = Math.floor((maxBoardPx - (n - 1) * 4) / n); // 4px gap
  const fontSize = cellSize > 32 ? Math.floor(cellSize * 0.3) : 12;
  const gridPx = cellSize * n + (n - 1) * 4;
  const wrapperPx = gridPx + borderPadding * 2;

  return (
    <div>
      {(() => {
        return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `3px solid ${borderColor}`,
            borderRadius: 12,
            padding: borderPadding,
            width: wrapperPx,
            height: wrapperPx,
            maxWidth: '90vw',
            maxHeight: '70vh',
            boxSizing: 'border-box',
            background: bgColor,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            transition: 'border-color 0.3s, box-shadow 0.3s, background 0.3s',
          }}>
            <div
              style={{
                display: "grid",
                gridTemplateRows: `repeat(${n}, ${cellSize}px)`,
                gridTemplateColumns: `repeat(${n}, ${cellSize}px)`,
                gap: 4,
                width: gridPx,
                height: gridPx,
              }}
            >
              {board.map((row, i) =>
                row.map((cell, j) => (
                  <button
                    key={`${i}-${j}`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      fontSize,
                      fontWeight: "bold",
                      cursor: cell || winner ? "not-allowed" : "pointer",
                      background: "#fff",
                      border: "1px solid #000",
                      boxSizing: "border-box",
                      position: "relative",
                      padding: 0,
                      overflow: "hidden"
                    }}
                    onClick={() => handleClick(i, j)}
                    disabled={!!cell || !!winner}
                  >
                    {cell === "X" && (
                      <Image src="/assets/x.png" alt="X" fill style={{ objectFit: "contain" }} />
                    )}
                    {cell === "O" && (
                      <Image src="/assets/o.png" alt="O" fill style={{ objectFit: "contain" }} />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
});

export default Board; 