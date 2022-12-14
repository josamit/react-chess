import React, { FC } from 'react';
import styles from './gamelog.module.scss';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { GameState, History } from '../redux/gameSlice';
import { BoardLettersByNumber } from '../types/game';
import { getFigure } from '../utils/figure';

const GameLog: FC = () => {
  const { history } = useSelector<RootState, GameState>((state) => state.game);
  console.log('history', history);
  const sliceIntoChunks = (arr: History[], chunkSize: number): History[][] => {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  };

  const historyChunks = sliceIntoChunks(history, 2);

  return (
    <div className={styles.gameLogWrapper}>
      <Table striped bordered hover responsive>
        <tbody>
          {historyChunks.map((item, index) => (
            <tr key={JSON.stringify(item)}>
              <td>{`${index + 1}.`}</td>
              <td>
                <div style={{ display: 'flex', alignContent: 'center' }}>
                  <div className={styles.figure}>
                    <svg
                      fill='none'
                      width='100%'
                      height='100%'
                      viewBox='0 0 72 72'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      {getFigure(item[0].figure, item[0].color)}
                    </svg>
                  </div>
                  {item[0]?.ateExistingPiece === true ? 'x' : ''}
                  {BoardLettersByNumber[item[0].to.x]}
                  {item[0].to.y}
                </div>
              </td>
              {item[1] !== undefined && (
                <td>
                  <div style={{ display: 'flex', alignContent: 'center' }}>
                    <div className={styles.figure}>
                      <svg
                        fill='none'
                        width='100%'
                        height='100%'
                        viewBox='0 0 72 72'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        {getFigure(item[1].figure, item[1].color)}
                      </svg>
                    </div>
                    {item[1]?.ateExistingPiece === true ? 'x' : ''}
                    {BoardLettersByNumber[item[1].to.x]}
                    {item[1].to.y}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default GameLog;
