import React, { useRef, useEffect } from 'react';

const createBoard = (rows: number, cols: number, initialValue: boolean): boolean[][] => {
  const board: boolean[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: boolean[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(initialValue);
    }
    board.push(row);
  }
  return board;
};

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const BLOCK_SIZE = 10;
  const NSIZE = 35; //30; // number of rows/columns
  const WIDTH = BLOCK_SIZE * NSIZE;
  const HEIGHT = WIDTH;
  const board: Boolean[][] = createBoard(NSIZE, NSIZE, true);

  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const paint = (ctx: CanvasRenderingContext2D) => {
    const size = BLOCK_SIZE;
    ctx.save();
    for (let i = 0; i < NSIZE; i++) {
      for (let j = 0; j < NSIZE; j++) {
        if (board[i][j]) {
          const x = i * size;
          const y = j * size;
          const r = getRandomInt(0, 255);
          const g = getRandomInt(0, 255);
          const b = getRandomInt(0, 255);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x, y, size, size);
        }
      }
      ctx.restore();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, WIDTH, HEIGHT);
        context.beginPath();
        paint(context);

      }
    }
  }, []);

  return (
    <div className="panel">
      <p className="panel-heading mb-4">Game of Life</p>
      <div className="columns is-centered">
        <div className="column is-half">
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            style={{ border: '1px solid #000000' }}>
          </canvas>
        </div>
      </div>
    </div>
  );
};

export default CanvasComponent;
