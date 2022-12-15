import React, { FC } from 'react';
import Board from '../board';
import GameLog from '../gamelog';
import './game.css';

const Game: FC = () => {
  return (
    <div className='gameContainer'>
      <div className='boardContainer'>
        <Board />
      </div>
      <div className='gameLogContainer'>
        <GameLog />
      </div>
    </div>
  );
};

export default Game;
