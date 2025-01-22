import React, { useRef, useState, useEffect, FormEvent, ChangeEvent, MouseEvent, useMemo } from 'react';
import Dropdown, { Option } from './Dropdown';
import { BoardBounds, boardTraverse, drawPlayer, drawWinResult } from './DrawingTTT';
import { TypedDocumentNode, useMutation, useSubscription } from '@apollo/client';
import {
  BoardMoveDocument,
  BoardMoveMutation,
  BoardMoveMutationVariables,
  CreateGameDocument,
  CreateGameMutation,
  CreateGameMutationVariables,
  GameUpdateByGameIdDocument,
  GameUpdateByGameIdSubscription,
  GameUpdateByGameIdSubscriptionVariables,
} from '../graphql/generated/graphql-ttt';

const CREATE_GAME: TypedDocumentNode<CreateGameMutation, CreateGameMutationVariables> = CreateGameDocument;
const BOARD_MOVE: TypedDocumentNode<BoardMoveMutation, BoardMoveMutationVariables> = BoardMoveDocument;
const UPDATE_GAME: TypedDocumentNode<GameUpdateByGameIdSubscription, GameUpdateByGameIdSubscriptionVariables> = GameUpdateByGameIdDocument;

const CanvasComponent: React.FC = () => {

  const [createGame, { data: createGameData, loading: createGameLoading, error: createGameError }] = useMutation(
    CREATE_GAME, {
    context: { service: 'ttt' }
  });

  const [boardMove] = useMutation(
    BOARD_MOVE, {
    context: { service: 'ttt' }
  });

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
  const [boardUpdated, setBoardUpdated] = useState(false);
  const [result, setResult] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const playerCharactors = [
    { label: 'X (Cross)', value: '1' },
    { label: 'O (Nought)', value: '2' },
  ];

  // GameID of null means no game in action - it shows the start game options
  const [gameId, setGameId] = useState<number>(-1);

  const [player, setPlayer] = useState<Option>(playerCharactors[0]);
  const [isOpponentStart, setIsOpponentStart] = useState(true);
  const [playerMove, setPlayerMove] = useState<number>(-1);
  const [playerHover, setPlayerHover] = useState<number>(-1);
  const [playMessage, setPlayMessage] = useState<string>(isOpponentStart ? "Opponent started. Good luck!" : "You make first move.");
  const [startButtonText, setStartButtonText] = useState('Start Game');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePlayerSelect = (newOption: Option) => {
    setPlayer(newOption);
  };

  const handleOpponentStart = (event: ChangeEvent<HTMLInputElement>) => {
    setIsOpponentStart(!isOpponentStart);
  };

  const handleCreateGameSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Used to call useMuataion newGame...
    if (gameId >= 0) {
      // When a game is with finish result, or the finish game button is pressed.
      // What happens is the backend Game table and GameID needs to be cleaned up. Would be another 
      // mutation is finished button is pressed, otherwise GameUpdateById will send game result, and 
      // the gameId is ended. We set gameId to -1 then.
      setStartButtonText('Start Game');
      setGameId(-1);
      setBoard(() => {
        const newBoard: number[] = Array(9).fill(0);
        return newBoard;
      });
    } else {
      const playerNumber = parseInt(player.value);
      createGame({
        variables: { player: playerNumber, opponentStart: isOpponentStart }
      });
    }
  };

  const handleOnMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const k = boardTraverse(x, y, boardBounds);
    setPlayerHover(k);
  };

  const handleOnMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (gameId >= 0 && boardUpdated) {
      const k = boardTraverse(x, y, boardBounds);
      if (board[k] === 0) {
        boardMove({
          variables: { gameId, moveCell: k }
        });
        setPlayerMove(k); // to draw this move for waiting for subscribed boardUpdate
        setBoardUpdated(false);
      }
    }
  };

  const handleOnMouseLeave = (event: MouseEvent<HTMLCanvasElement>) => {
    setPlayerHover(-1);
  };


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

          if (gameId >= 0) {
            if (board[k] >= ALIVE) {
              drawPlayer(ctx, x, y, blockSize, board[k], GAME_COLORS[6]);
            } else {
              if (k === playerMove) {
                const playerNumber = parseInt(player.value);
                drawPlayer(ctx, x, y, blockSize, playerNumber, GAME_COLORS[6]);
              }
              if (boardUpdated) {
                if (k === playerHover) {
                  const playerNumber = parseInt(player.value);
                  drawPlayer(ctx, x, y, blockSize, playerNumber, GAME_COLORS[6]);
                }
              }
            }
          }

        }
      }

      // Draw win result line
      if (gameId >= 0)
        drawWinResult(ctx, result, GAME_COLORS[4], rowSize, colSize, blockSize);

    };

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const animationFrameId = requestAnimationFrame(() => paint(ctx));
        return () => cancelAnimationFrame(animationFrameId);
      }
    }
  }, [board, boardUpdated, result, boardBounds, playerHover, playerMove, player, gameId]);

  const gameOption = (title: string, buttonText: string, change: boolean) => (
    <div className='panel ml-3'>
      <p className="panel-heading mb-4 is-size-7">{title}</p>
      <div className='panel-block'>
        <form onSubmit={handleCreateGameSubmit}>
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

  useEffect(() => {
    if (createGameLoading) {
      setStartButtonText('Creating...');
    } else if (createGameData) {
      console.log(createGameData.createGame);
      setGameId(createGameData.createGame.id);
      setPlayMessage(createGameData.createGame.opponentStart ? "Opponent started. Good luck!" : "You make first move.")
      setStartButtonText('Creating...');
      setBoard(() => {
        let newBoard: number[] = Array(9).fill(0);
        return newBoard;
      });
      setResult(() => {
        let newResult: number[] = Array(9).fill(0);
        return newResult;
      });
      setBoardUpdated(false);
    }
  }, [createGameData, createGameLoading, createGameError]);

  useSubscription(
    UPDATE_GAME, {
    variables: { gameId },
    context: { service: 'ttt' },
    skip: gameId === -1,
    onData({ data }) {
      if (data.data?.game_Update) {
        console.log('subscribe got board', data.data.game_Update.board, data.data.game_Update.gameId);
        setPlayMessage(isOpponentStart ? "Opponent started. Good luck!" : "You make first move.");
        const newBoard = data.data.game_Update?.board.split(",");
        setBoard(newBoard.map((cell) => parseInt(cell)));
        setPlayerMove(-1);
        setBoardUpdated(true);
      }
    }
  });

  const { rowSize, colSize, blockSize } = boardBounds;
  return (
    <div className="panel">
      <p className="panel-heading mb-4">Tic Tac Toe {gameId}</p>
      <div className="columns">
        <div className="column is-one-third">
          {gameId === -1 && gameOption('Select Game Options', startButtonText, true)}
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
