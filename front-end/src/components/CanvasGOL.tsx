import React, { useRef, useEffect, useCallback } from 'react';

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
  const BLOCK_SIZE = 2;
  const NSIZE = 380; //30; // number of rows/columns
  const WIDTH = BLOCK_SIZE * NSIZE;
  const HEIGHT = WIDTH / 2;
  const ALIVE = true;
  //const DEAD = false;

  const board: Boolean[][] = createBoard(NSIZE, NSIZE, false);
  const duration = 1000;
  const genDuration = 1000;

  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const initBoard = () => {
    for (let i = 0; i < NSIZE; i++) {
      for (let j = 0; j < NSIZE; j++) {
        const r = getRandomInt(0, 1000);
        if (r < 180) {
          board[i][j] = ALIVE;
        }
      }
    }

  };

  initBoard();

  // Update GOL board on set inteval callback
  const neighbourCount = useCallback((x: number, y: number): number => {
    const OFFSETS: { x: number; y: number }[] = [
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ];

    return OFFSETS.reduce((prev, curr, i, arr) => {
      const xp = x + curr.x;
      const yp = y + curr.y;

      if (!(xp < 0 || yp < 0 || xp >= NSIZE || yp >= NSIZE)) {
        if (board[xp][yp] === ALIVE)
          prev++;
      }

      return prev;
    }, 0);
  }, [ALIVE, board]);

  const updateBoard = useCallback(() => {
    const toggleCells: { x: number; y: number }[] = [];

    for (let i = 0; i < NSIZE; i++) {
      for (let j = 0; j < NSIZE; j++) {
        let n = neighbourCount(i, j);
        if (board[i][j] === ALIVE) {
          if (n < 2)
            toggleCells.push({ x: i, y: j });
          if (n > 3)
            toggleCells.push({ x: i, y: j });
        } else {
          if (n === 3)
            toggleCells.push({ x: i, y: j });
        }
      }
    }

    for (const { x, y } of toggleCells) {
      board[x][y] = !board[x][y];
    }
  }, [neighbourCount, ALIVE, board]);


  const paint = useCallback((ctx: CanvasRenderingContext2D) => {
    const size = BLOCK_SIZE;
    const ALIVE_COLOR = 'rgb(0, 255, 0)'; // Green for alive cells
    const DEAD_COLOR = 'rgb(255, 255, 255)'; // White for dead cells
   // ctx.save();
    for (let i = 0; i < NSIZE; i++) {
      for (let j = 0; j < NSIZE; j++) {
        const x = i * size;
        const y = j * size;
        if (board[i][j] === ALIVE) {
          const r = 0; //getRandomInt(0, 255);
          const g = 255; //getRandomInt(0, 255);
          const b = 0;//getRandomInt(0, 255);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        } else {
          ctx.fillStyle = DEAD_COLOR;
        }
        ctx.fillRect(x, y, size, size);
      }
    }
    //ctx.restore();
  }, [board]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    paint(ctx);
  }, [WIDTH, HEIGHT, paint]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.beginPath();
        setInterval(() => draw(ctx), duration);
        setInterval(() => updateBoard(), genDuration);
      }
    }
  }, [HEIGHT, WIDTH, draw, updateBoard]);

  return (
    <div className="panel">
      <p className="panel-heading mb-4">Game of Life</p>
      <div className="columns is-centered">
        <div className="column is-half">
          <canvas onClick={initBoard}
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
