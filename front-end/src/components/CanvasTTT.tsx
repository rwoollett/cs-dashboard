import React, { useRef, useState, useEffect, FormEvent, ChangeEvent, MouseEvent } from 'react';
import Dropdown, { Option } from './Dropdown';
//import { gql, TypedDocumentNode } from '@apollo/client';
//import _ from 'lodash';

const CanvasComponent: React.FC = () => {
  const rowSize = 3;
  const colSize = 3;
  const blockSize = 80;
  const board: number[] = Array(9).fill(0);
  // const [genBoard, setGenBoard] = useState<number[]>(() => {
  //   const initArray: number[] = Array(3).fill(0);
  //   return initArray;
  // });
  board[0] = 2;
  board[4] = 1;
  board[8] = 2;
  const playerCharactors = [
    { label: 'X (Cross)', value: '1' },
    { label: 'O (Nought)', value: '2' },
  ];
  //const [gameId, setGameId] = useState(0);
  const gameId = 0;
  const [player, setPlayer] = useState<Option>(playerCharactors[0]);
  const [isOpponentStart, setIsOpponentStart] = useState(true);
  const [playerMove, setPlayerMove] = useState<number>(-1);
  const [playerHover, setPlayerHover] = useState<number>(-1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePlayerSelect = (newOption: Option) => {
    console.log(newOption.label, ' ', newOption.value);
    setPlayer(newOption);
  };

  const handleOpponentStart = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setIsOpponentStart(!isOpponentStart);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Used to call useMuataion newGame...
  };

  const boardTraverse = (rect: DOMRect, x: number, y: number, dispatch: React.Dispatch<React.SetStateAction<number>>) => {
    for (let i = 0; i < rowSize; i++) {
      for (let j = 0; j < colSize; j++) {
        const cy = i * blockSize;
        const cx = j * blockSize;
        const k = (i * rowSize) + j;
        if (x > cx && x < (cx + blockSize) &&
          y > cy && y < (cy + blockSize)) {
          dispatch(k);
        }
      }
    }
  };

  const handleOnMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    boardTraverse(rect, x, y, setPlayerHover);
  };

  const handleOnMouseLeave = (event: MouseEvent<HTMLCanvasElement>) => {
    setPlayerHover(-1);
  };

  const handleOnMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    boardTraverse(rect, x, y, setPlayerMove);
  };

  // const UPDATE_GAME: TypedDocumentNode<BoardGenerationSubscription, BoardGenerationSubscriptionVariables> = gql`
  //       subscription BoardGeneration {
  //         board_Generation {
  //           genId
  //           rows
  //           cols
  //           board
  //         }
  //       }
  //     `;

  // useSubscription(
  //   UPDATE_GAME, {
  //   context: { service: 'gol' },
  //   onData({ data }) {
  //     if (data.data?.board_Generation) {
  //       //console.log('posted gen board', data.data.board_Generation.board);
  //       setGameId(data.data?.board_Generation.genId);
  //       setBlockSize(10);
  //       setColSize(data.data?.board_Generation.cols);
  //       setRowSize(data.data?.board_Generation.rows);
  //       setGenBoard((prev) => _.cloneDeep(data.data!.board_Generation!.board));
  //     }
  //   }
  // });

  useEffect(() => {
    const GAME_COLORS: string[] = [
      'rgb(255, 255, 255)', // White for dead cells
      'rgb(0, 0, 0)',       // 1 Black
      'rgb(0, 255, 0)',     // 2 Green  
      'rgb(255, 255, 0)',   // 3 Lemon
      'rgb(255, 82, 4)',    // 3 Orange
      'rgb(201, 208, 181)', // 4 Pear
      'rgb(0, 255, 0)',     // 5 Lime
      'rgb(167, 12, 28)',   // 6 Strawberry
      'rgb(175, 195, 102)', // 7 Grape
      'rgb(255, 136, 5)',   // 8 Manderine
      'rgb(255, 5, 5)'      // 9 Apple
    ];

    const drawPlayer = (ctx: CanvasRenderingContext2D, x: number, y: number, player: number) => {

      const size = blockSize;
      const centred = size / 2;
      const radius = centred - 8;
      switch (player) {
        case 1:
          // Cross
          ctx.beginPath();
          ctx.lineWidth = 4;
          ctx.strokeStyle = GAME_COLORS[6];
          ctx.moveTo(x + 18, y + 10);
          ctx.lineTo(x + size - 18, y + size - 10);
          ctx.moveTo(x - 18 + size, y + 10);
          ctx.lineTo(x + 18, y + size - 10);
          ctx.stroke();
          break;

        case 2:
          // Only can be Nought as two options
          ctx.beginPath();
          ctx.lineWidth = 4;
          ctx.strokeStyle = GAME_COLORS[6];
          ctx.ellipse(x + centred, y + centred, radius - 3, radius, Math.PI, 0, 2 * Math.PI);
          ctx.stroke();
          break;

        default:
          // should not get here
          break;
      }
    };
    const paint = (ctx: CanvasRenderingContext2D) => {
      const ALIVE = 1;
      const BLANK_COLOR = GAME_COLORS[0]; // White for blank cells
      const LINE_COLOR = GAME_COLORS[1]; // White for blank cells

      ctx.fillStyle = LINE_COLOR; // The lines are dark coloured
      ctx.clearRect(0, 0, colSize * blockSize, rowSize * blockSize);
      ctx.fillRect(1, 1, (colSize * blockSize) - 2, (rowSize * blockSize) - 2);

      for (let i = 0; i < rowSize; i++) {
        for (let j = 0; j < colSize; j++) {
          const y = i * blockSize;
          const x = j * blockSize;
          const k = (i * rowSize) + j;

          ctx.fillStyle = BLANK_COLOR;
          ctx.fillRect(x + 1, y + 1, blockSize - 2, blockSize - 2); // The cell background

          if (board[k] >= ALIVE) {
            drawPlayer(ctx, x, y, board[k]);
          } else {
            if (k === playerHover) {
              const playerNumber = parseInt(player.value);
              drawPlayer(ctx, x, y, playerNumber);
            }
            if (k === playerMove) {
              const playerNumber = parseInt(player.value);
              drawPlayer(ctx, x, y, playerNumber);
            }
          }
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
  }, [board, playerHover, playerMove, player]);

  return (
    <div className="panel">
      <p className="panel-heading mb-4">Tic Tac Toe {gameId}</p>
      <div className="columns">
        <div className="column">
          <div className='panel'>
            <p className="panel-heading mb-4 is-size-7">Select Game Options</p>
            <div className='panel-block'>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">Play Charactor</label>
                  <Dropdown options={playerCharactors} value={player} onChange={handlePlayerSelect} />
                </div>
                <div className="field">
                  <div className="control">
                    <label className="checkbox is-size-6">Opponent starts <input checked={isOpponentStart} onChange={handleOpponentStart} type="checkbox" className='is-size-6' /></label>
                  </div>
                </div>
                <div className="field is-grouped">
                  <div className="control">
                    <button className="button is-link">Start Game</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="column">
          <canvas className='is-clickable'
            onMouseMove={handleOnMouseMove}
            onMouseDown={handleOnMouseDown}
            onMouseLeave={handleOnMouseLeave}
            ref={canvasRef}
            width={colSize * blockSize}
            height={rowSize * blockSize}
            style={{ border: '1px solid #EEEEEE' }}>
          </canvas>
        </div>
      </div>
    </div>
  );
};

export default CanvasComponent;
