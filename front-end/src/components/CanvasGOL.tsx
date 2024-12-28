import { gql, TypedDocumentNode, useSubscription } from '@apollo/client';
import React, { useRef, useState, useEffect } from 'react';
import { BoardGenerationSubscription, BoardGenerationSubscriptionVariables } from '../graphql/generated/graphql-gol';
import _ from 'lodash';


const CanvasComponent: React.FC = () => {
  const [rowSize, setRowSize] = useState(30);
  const [colSize, setColSize] = useState(40);
  const [blockSize, setBlockSize] = useState(10)
  const [genBoard, setGenBoard] = useState<number[][]>(() => {
    const initArray: number[][] = Array.from({ length: 30 }, () => Array(40).fill(1));
    return initArray;
  });

  const BOARD_GENERATE: TypedDocumentNode<BoardGenerationSubscription, BoardGenerationSubscriptionVariables> = gql`
        subscription BoardGeneration {
          board_Generation {
            genId
            rows
            cols
            board
          }
        }
      `;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useSubscription(
    BOARD_GENERATE, {
    context: { service: 'gol' },
    onData({ data }) {
      if (data.data?.board_Generation) {
        console.log('posted gen board', data.data.board_Generation.board);
        setBlockSize(10);
        setColSize(data.data?.board_Generation.cols);
        setRowSize(data.data?.board_Generation.rows);
        setGenBoard((prev) => _.cloneDeep(data.data!.board_Generation!.board));
      }
    }
  });

  useEffect(() => {
    const paint = (ctx: CanvasRenderingContext2D) => {
      const size = blockSize;
      const ALIVE = 1;
      //const ALIVE_COLOR = 'rgb(0, 255, 0)'; // Green for alive cells
      console.log('paint');

      ctx.fillStyle = '#FFFFFF';
      ctx.clearRect(0, 0, colSize * size, rowSize * size);
      console.log('paint gen board', genBoard[0]);
      const DEAD_COLOR = 'rgb(255, 255, 255)'; // White for dead cells
      for (let i = 0; i < rowSize; i++) {
        for (let j = 0; j < colSize; j++) {
          const y = i * size;
          const x = j * size;
          if (genBoard[i][j] === ALIVE) {
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
    };

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const animationFrameId = requestAnimationFrame(() => paint(ctx));
        return () => cancelAnimationFrame(animationFrameId);
      }
    }
  }, [blockSize, rowSize, colSize, genBoard]);

  return (
    <div className="panel">
      <p className="panel-heading mb-4">Game of Life</p>
      <div className="columns">
        <div className="column">
          <canvas
            ref={canvasRef}
            width={colSize * blockSize}
            height={rowSize * blockSize}
            style={{ border: '1px solid #000000' }}>
          </canvas>
        </div>
      </div>
    </div>
  );
};

export default CanvasComponent;
