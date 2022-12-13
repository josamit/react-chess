import React, { FC, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeFigurePosition, GameState, setColor } from '../redux/gameSlice';
import { RootState } from '../redux/store';
import { BoardLettersByNumber, Colors, FigureData } from '../types/game';
import Cell from '../cell';
import Figure from '../figure';
import styles from './board.module.scss';

const Board: FC = () => {
  const dispatch = useDispatch();
  dispatch(setColor(Colors.WHITE));

  const { figures } = useSelector<RootState, GameState>((state) => state.game);

  const boardRef = useRef<HTMLDivElement>(null);

  const [choseFigurePos, setChoseFigurePos] = useState<{
    figure: FigureData;
    availableCells: { [key: string]: boolean };
  } | null>(null);

  const cellsFigure: { [key: string]: FigureData | null } = {};

  const isAvailableCellForMove = (x: number, y: number): boolean =>
    choseFigurePos?.availableCells[`${x}-${y}`] === true;

  const isCellHavingFigure = (x: number, y: number): boolean => cellsFigure[`${x}-${y}`] != null;

  const moveOn = (figure: FigureData, x: number, y: number): void => {
    cellsFigure[`${figure.x}-${figure.y}`] = null;
    cellsFigure[`${x}-${y}`] = figure;
    dispatch(changeFigurePosition({ figure, x, y }));
    setChoseFigurePos(null);
  };

  const cellClicked = (x: number, y: number): void => {
    if (choseFigurePos == null) return;
    if (!choseFigurePos.availableCells[`${x}-${y}`]) return;

    moveOn(choseFigurePos.figure, x, y);
    // TODO: nextAIMoveDelayed();
  };

  const isSelectedCell = (x: number, y: number): boolean => {
    if (choseFigurePos == null) return false;
    return choseFigurePos.figure.x === x && choseFigurePos.figure.y === y;
  };

  const isEatableFigure = (figure: FigureData): boolean => {
    if (choseFigurePos == null) return false;
    return choseFigurePos.availableCells[`${figure.x}-${figure.y}`];
  };

  const isSelectedFigure = (figure: FigureData): boolean => {
    if (choseFigurePos == null) return false;
    return choseFigurePos.figure.id === figure.id;
  };

  const initCells = (): JSX.Element[] => {
    const cells: JSX.Element[] = [];
    for (let y = 8; y >= 1; y--) {
      for (let x = 1; x <= 8; x++) {
        cellsFigure[`${x}-${y}`] = null;
        const boardLetter = BoardLettersByNumber[x];
        if ((y + x) % 2 !== 0) {
          cells.push(
            <Cell
              color={Colors.BLACK}
              x={boardLetter}
              y={y}
              key={`${boardLetter}-${y}`}
              isAvailableForMove={isAvailableCellForMove(x, y)}
              isHavingFigure={isCellHavingFigure(x, y)}
              cellClicked={cellClicked}
              isSelected={isSelectedCell(x, y)}
            />,
          );
        } else {
          cells.push(
            <Cell
              color={Colors.WHITE}
              x={boardLetter}
              y={y}
              key={`${boardLetter}-${y}`}
              isAvailableForMove={isAvailableCellForMove(x, y)}
              isHavingFigure={isCellHavingFigure(x, y)}
              cellClicked={cellClicked}
              isSelected={isSelectedCell(x, y)}
            />,
          );
        }
      }
    }
    return cells;
  };

  const initFigures = (): React.ReactElement[] => {
    const figuresJSX: React.ReactElement[] = [];

    for (const item in figures) {
      cellsFigure[`${figures[item].x}-${figures[item].y}`] = figures[item];
      figuresJSX.push(
        <Figure
          key={figures[item].id}
          figure={figures[item]}
          // TODO: add impl
          figureClicked={() => {}}
          isEatable={isEatableFigure(figures[item])}
          isSelected={isSelectedFigure(figures[item])}
        />,
      );
    }

    return figuresJSX;
  };

  return (
    <div ref={boardRef} className={styles.boardWrapper}>
      <ul className={styles.boardLeft}>
        <li className={styles.boardLeftItem}>1</li>
        <li className={styles.boardLeftItem}>2</li>
        <li className={styles.boardLeftItem}>3</li>
        <li className={styles.boardLeftItem}>4</li>
        <li className={styles.boardLeftItem}>5</li>
        <li className={styles.boardLeftItem}>6</li>
        <li className={styles.boardLeftItem}>7</li>
        <li className={styles.boardLeftItem}>8</li>
      </ul>

      <ul className={styles.boardBottom}>
        <li className={styles.boardBottomItem}>A</li>
        <li className={styles.boardBottomItem}>B</li>
        <li className={styles.boardBottomItem}>C</li>
        <li className={styles.boardBottomItem}>D</li>
        <li className={styles.boardBottomItem}>E</li>
        <li className={styles.boardBottomItem}>F</li>
        <li className={styles.boardBottomItem}>G</li>
        <li className={styles.boardBottomItem}>H</li>
      </ul>
      <ul className={styles.board}>
        {initCells()}
        {initFigures()}
      </ul>
    </div>
  );
};

export default Board;
