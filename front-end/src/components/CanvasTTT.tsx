import React, { useRef, useState, useEffect, FormEvent, ChangeEvent, MouseEvent, useMemo } from 'react';
import Dropdown, { Option } from './Dropdown';
import { BoardBounds, boardTraverse, drawPlayer, drawWinResult } from './DrawingTTT';
//import { gql, TypedDocumentNode } from '@apollo/client';
//import _ from 'lodash';

const CanvasComponent: React.FC = () => {

  const boardBounds: BoardBounds = useMemo(() => {
    return {
      rowSize: 3,
      colSize: 3,
      blockSize: 80
    }
  }, []);

  const [board, setBoard] = useState<number[]>(() => {
    return Array(9).fill(0);
  });

  const win = useMemo(() => [0, 0, 1, 0, 1, 0, 1, 0, 0], []);

  const playerCharactors = [
    { label: 'X (Cross)', value: '1' },
    { label: 'O (Nought)', value: '2' },
  ];

  // GameID of -1 means no game in action - it shows the start game options
  const [gameId, setGameId] = useState(-1);

  //const gameId = 1;
  const [player, setPlayer] = useState<Option>(playerCharactors[0]);
  const [isOpponentStart, setIsOpponentStart] = useState(true);
  const [playerMove, setPlayerMove] = useState<number>(-1);
  const [playerHover, setPlayerHover] = useState<number>(-1);
  const [playMessage, setPlayMessage] = useState<string>(isOpponentStart ? "Opponent started. Good luck!" : "You make first move.");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePlayerSelect = (newOption: Option) => {
    setPlayer(newOption);
  };

  const handleOpponentStart = (event: ChangeEvent<HTMLInputElement>) => {
    setIsOpponentStart(!isOpponentStart);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Used to call useMuataion newGame...
    if (gameId >= 0) {
      setGameId(-1);
      setBoard(() => {
        const newBoard: number[] = Array(9).fill(0);
        return newBoard;
      });
    } else {
      setGameId(2);
      setPlayMessage(isOpponentStart ? "Opponent started. Good luck!" : "You make first move.")
      setBoard(() => {
        let newBoard: number[] = Array(9).fill(0);
        newBoard[0] = 2;
        newBoard[4] = 1;
        newBoard[8] = 1;
        return newBoard;
      });
    }
  };

  const handleOnMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    boardTraverse(x, y, boardBounds, setPlayerHover);
  };

  const handleOnMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    boardTraverse(x, y, boardBounds, setPlayerMove);
  };

  const handleOnMouseLeave = (event: MouseEvent<HTMLCanvasElement>) => {
    setPlayerHover(-1);
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

    const paint = (ctx: CanvasRenderingContext2D) => {
      const ALIVE = 1;
      const BLANK_COLOR = GAME_COLORS[0]; // White for blank cells
      const LINE_COLOR = GAME_COLORS[1];  // The lines are dark coloured
      const { rowSize, colSize, blockSize } = boardBounds;
      ctx.fillStyle = LINE_COLOR;
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
            drawPlayer(ctx, x, y, blockSize, board[k], GAME_COLORS[6]);
          } else {
            if (k === playerHover) {
              const playerNumber = parseInt(player.value);
              drawPlayer(ctx, x, y, blockSize, playerNumber, GAME_COLORS[6]);
            }
            if (k === playerMove) {
              const playerNumber = parseInt(player.value);
              drawPlayer(ctx, x, y, blockSize, playerNumber, GAME_COLORS[6]);
            }
          }

        }
      }

      // Draw win result line
      drawWinResult(ctx, win, GAME_COLORS[4], rowSize, colSize, blockSize);

    };

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const animationFrameId = requestAnimationFrame(() => paint(ctx));
        return () => cancelAnimationFrame(animationFrameId);
      }
    }
  }, [board, boardBounds, win, playerHover, playerMove, player]);

  const gameOption = (title: string, buttonText: string, change: boolean) => (
    <div className='panel ml-3'>
      <p className="panel-heading mb-4 is-size-7">{title}</p>
      <div className='panel-block'>
        <form onSubmit={handleSubmit}>
          <div className="field ">
            <label className="label">Play Charactor</label>
            {change && (<Dropdown style={{ width: "200px" }} options={playerCharactors} value={player} onChange={handlePlayerSelect} />)}
            {change || (<div className="has-text-weight-semibold ml-4 pt-1 pb-2 is-size-6">{player.label}</div>)}
          </div>
          <div className="field">
            <div className="control">
              {change && (<label className="checkbox is-size-6">Opponent starts <input checked={isOpponentStart} onChange={handleOpponentStart} type="checkbox" className='is-size-6' /></label>)}
              {change || playMessage}
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button is-link">{buttonText}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const { rowSize, colSize, blockSize } = boardBounds;
  return (
    <div className="panel">
      <p className="panel-heading mb-4">Tic Tac Toe {gameId}</p>
      <div className="columns">
        <div className="column is-one-third">
          {gameId < 0 && gameOption('Select Game Options', 'Start Game', true)}
          {gameId >= 0 && gameOption('Playing Tic Tac Toe!', 'Finish Game', false)}
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
