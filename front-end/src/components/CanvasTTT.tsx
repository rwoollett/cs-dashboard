import { gql, TypedDocumentNode, useSubscription } from '@apollo/client';
import React, { useRef, useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { BoardGenerationSubscription, BoardGenerationSubscriptionVariables } from '../graphql/generated/graphql-gol';
import _ from 'lodash';
import Dropdown, { Option } from './Dropdown';


const CanvasComponent: React.FC = () => {
  const [rowSize, setRowSize] = useState(30);
  const [colSize, setColSize] = useState(40);
  const [blockSize, setBlockSize] = useState(10)
  const [genBoard, setGenBoard] = useState<number[][]>(() => {
    const initArray: number[][] = Array.from({ length: 30 }, () => Array(40).fill(1));
    return initArray;
  });
  const [gameId, setGameId] = useState(0);
  const [player, setPlayer] = useState("X");
  const [selection, setSelection] = useState<Option | null>(null);
  const [opponentStart, setOpponentStart] = useState(true);

  const options = [
    { label: 'X (Cross)', value: 'X' },
    { label: 'O (Nought)', value: 'O' },
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPlayer(event.target.value);
  };

  const handlePlayerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log('select value', event.target.value);
    setPlayer(event.target.value);
  };

  const handleSelect = (newOption: Option) => {
    console.log(newOption.label, ' ', newOption.value);
    setSelection(newOption);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //onSubmit();
    //editBookById(book.id, title);
  };


  const UPDATE_GAME: TypedDocumentNode<BoardGenerationSubscription, BoardGenerationSubscriptionVariables> = gql`
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
    const paint = (ctx: CanvasRenderingContext2D) => {
      const size = blockSize;
      const ALIVE = 1;
      const ALIVE_COLORS: string[] = [
        'rgb(255, 255, 255)', // White for dead cells
        'rgb(0, 255, 0)',     // 1 Black(Alive green  )
        'rgb(255, 255, 0)',   // 2 Lemon
        'rgb(255, 82, 4)',    // 3 Orange
        'rgb(201, 208, 181)', // 4 Pear
        'rgb(0, 255, 0)',     // 5 Lime
        'rgb(167, 12, 28)',   // 6 Strawberry
        'rgb(175, 195, 102)', // 7 Grape
        'rgb(255, 136, 5)',   // 8 Manderine
        'rgb(255, 5, 5)'      // 8 Apple
      ];
      //console.log('paint');

      ctx.fillStyle = '#FFFFFF';
      ctx.clearRect(0, 0, colSize * size, rowSize * size);
      //console.log('paint gen board', genBoard[0]);
      const DEAD_COLOR = 'rgb(255, 255, 255)'; // White for dead cells
      for (let i = 0; i < rowSize; i++) {
        for (let j = 0; j < colSize; j++) {
          const y = i * size;
          const x = j * size;
          if (genBoard[i][j] >= ALIVE) {
            // const r = 0; //getRandomInt(0, 255);
            // const g = 255; //getRandomInt(0, 255);
            // const b = 0;//getRandomInt(0, 255);
            //ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillStyle = ALIVE_COLORS[genBoard[i][j]];
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
      <p className="panel-heading mb-4">Tic Tac Toe {gameId}</p>
      <div className="columns">
        <div className="column">
          <form onSubmit={handleSubmit}>
            {/* <label className='label'>Player</label>
            <input className='input' value={player} onChange={handleChange} />
 */}

            <div className="field">
              <label className="label">Player</label>
              <Dropdown options={options} value={selection} onChange={handleSelect} />
            </div>

            {/* <div className="field">
              <label className="label">Player</label>
              <div className="control">
                <div className="select is-normal is-multiple">
                  <select size={4} value={player} onChange={handlePlayerChange}>
                    <option>X</option>
                    <option>0</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Player</label>
              <div className="control">
                <label className="radio">Play as
                  <input type="radio" name="player" />
                  X
                </label>
                <label className="radio"> or as O
                  <input type="radio" name="player" />
                </label>
              </div>
            </div> */}

            <div className="field">
              <div className="control">
                <label className="checkbox">Opponent starts <input type="checkbox" /></label>
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button className="button is-link">Start Game</button>
              </div>
              <div className="control">
                <button className="button is-link is-light">Cancel</button>
              </div>
            </div>
          </form>
        </div>
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
