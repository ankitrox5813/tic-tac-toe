"use client";
import Image from "next/image";
import Board from "./Board.jsx";
import { useState, useRef } from "react";
import Header from "./Header.jsx";

function getStatusColor(status) {
  if (!status) return '#e5e7eb'; // default gray
  if (status.startsWith('Winner')) return '#16a34a'; // green
  if (status.startsWith('Draw')) return '#6b7280'; // gray
  if (status.endsWith('X')) return '#2563eb'; // blue
  if (status.endsWith('O')) return '#dc2626'; // red
  return '#e5e7eb';
}

function hexToRgba(hex, alpha) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const num = parseInt(hex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function Home() {
  const [n, setN] = useState(4);
  const [m, setM] = useState(4);
  const boardRef = useRef();
  // We'll use a callback to get status and reset from Board
  const [status, setStatus] = useState("");
  const handleReset = () => {
    if (boardRef.current) {
      boardRef.current.resetBoard();
    }
  };

  const borderColor = getStatusColor(status);
  const bgColor = hexToRgba(borderColor, 0.18);
  // For ambient gradient, use a radial gradient with borderColor
  const ambientGradient = `radial-gradient(circle at 60% 40%, ${hexToRgba(borderColor, 0.25)} 0%, #f8fafc 100%)`;

  return (
    <div
      className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]"
      style={{
        background: ambientGradient,
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Header n={n} setN={setN} m={m} setM={setM} status={status} onReset={handleReset}
        borderColor={borderColor}
        bgColor={bgColor}
      />
      {/* Board below header */}
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="my-8 w-full flex flex-col items-center gap-4">
          <Board n={n} m={m} setStatus={setStatus} ref={boardRef}
            borderColor={borderColor}
            bgColor={bgColor}
          />
        </div>
      </main>
    </div>
  );
}
