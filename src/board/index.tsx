import React, { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeFigurePosition,
  GameState,
  removeFigure,
  setColor,
  setGameStarted,
  setGameWon,
} from '../redux/gameSlice';
import { RootState } from '../redux/store';
import { BoardLettersByNumber, Colors, FigureData, Figure as FigureEnum } from '../types/game';
import Cell from '../cell';
import Figure from '../figure';
import styles from './board.module.scss';

const Board: FC = () => {
  const dispatch = useDispatch();
  dispatch(setColor(Colors.WHITE));

  const { figures, color } = useSelector<RootState, GameState>((state) => state.game);

  const boardRef = useRef<HTMLDivElement>(null);

  const [choseFigurePos, setChoseFigurePos] = useState<{
    figure: FigureData;
    availableCells: { [key: string]: boolean };
  } | null>(null);

  const [isKingInCheck, setIsKingInCheck] = useState<boolean>(false);

  const sides = {
    ally: color,
    enemy: color === Colors.WHITE ? Colors.BLACK : Colors.WHITE,
  };

  const dangerousCells: MutableRefObject<{
    white: { [key: string]: boolean };
    black: { [key: string]: boolean };
  }> = useRef({ white: {}, black: {} });

  const resizeBoard = (): void => {
    const paddingsWidth = 48 + 12;
    const paddingHeight = 52 + 12;

    if (boardRef.current != null) {
      const board = boardRef.current;
      board.style.height = '';
      board.style.width = '';

      const boardRect = board.getBoundingClientRect();
      const boardWidth = boardRect.width - paddingsWidth + paddingHeight;
      const boardHeight = boardRect.height - paddingHeight + paddingsWidth;

      if (boardHeight > boardWidth) {
        board.style.height = `${boardWidth}px`;
      } else {
        board.style.width = `${boardHeight}px`;
      }
    }
  };

  const getFiguresBySide = (color: Colors): FigureData[] => {
    return Object.keys(figures)
      .filter((figureId) => figures[figureId].color === color)
      .map((figureId) => figures[figureId]);
  };

  const updateAllAvailableCells = (): void => {
    dangerousCells.current.white = {};
    dangerousCells.current.black = {};
    const whiteFigures = getFiguresBySide(Colors.WHITE);
    const blackFigures = getFiguresBySide(Colors.BLACK);
    whiteFigures.forEach((figure) => {
      dangerousCells.current.white = {
        ...dangerousCells.current.white,
        ...getAvailableCells(figure, true),
      };
    });
    blackFigures.forEach((figure) => {
      dangerousCells.current.black = {
        ...dangerousCells.current.black,
        ...getAvailableCells(figure, true),
      };
    });
  };

  const checkIsKingInCheck = (color: Colors): void => {
    updateAllAvailableCells();
    const kings = {
      [Colors.WHITE]: figures['white-king-5-1'],
      [Colors.BLACK]: figures['black-king-5-8'],
    };
    const king = kings[color];
    if (dangerousCells.current[getOtherColor(color)][`${king.x}-${king.y}`]) setIsKingInCheck(true);
    else setIsKingInCheck(false);
  };

  useEffect(() => {
    checkIsKingInCheck(sides.ally);
  }, [figures]);

  useEffect(() => {
    resizeBoard();
    window.addEventListener('resize', resizeBoard);
    dispatch(setGameStarted(true));
  }, []);

  const cellsFigure: { [key: string]: FigureData | null } = {};

  const isAvailableCellForMove = (x: number, y: number): boolean =>
    choseFigurePos?.availableCells[`${x}-${y}`] === true;

  const isCellHavingFigure = (x: number, y: number): boolean => cellsFigure[`${x}-${y}`] != null;

  const getOtherColor = (color: Colors): Colors => {
    return color === Colors.BLACK ? Colors.WHITE : Colors.BLACK;
  };

  const moveOn = (figure: FigureData, x: number, y: number): void => {
    cellsFigure[`${figure.x}-${figure.y}`] = null;
    cellsFigure[`${x}-${y}`] = figure;
    dispatch(changeFigurePosition({ figure, x, y }));
    setChoseFigurePos(null);
  };

  const getAvailableCells = (
    figure: FigureData,
    isForDangerousCells: boolean = false,
  ): { [key: string]: boolean } => {
    let way: Array<{ y: number; x: number }> = [];

    const toStopWay = (x: number, y: number): boolean => {
      if (cellsFigure[`${x}-${y}`] === undefined) return true;
      return cellsFigure[`${x}-${y}`] != null;
    };

    const checkCellForMove = (x: number, y: number): boolean => {
      if (toStopWay(x, y)) return false;
      way.push({ x, y });
      return true;
    };

    const verticalTop = (toY: number, fromY: number = figure.y): void => {
      for (let i = fromY + 1; i <= toY; i++) {
        if (toStopWay(figure.x, i)) return;
        way.push({ y: i, x: figure.x });
      }
    };

    const verticalBottom = (toY: number, fromY: number = figure.y): void => {
      for (let i = fromY - 1; i >= toY; i--) {
        if (toStopWay(figure.x, i)) return;
        way.push({ y: i, x: figure.x });
      }
    };

    const horizontalLeft = (toX: number, fromX: number = figure.x): void => {
      for (let i = fromX - 1; i >= toX; i--) {
        if (toStopWay(i, figure.y)) return;
        way.push({ x: i, y: figure.y });
      }
    };

    const horizontalRight = (toX: number, fromX: number = figure.x): void => {
      for (let i = fromX + 1; i <= toX; i++) {
        if (toStopWay(i, figure.y)) return;
        way.push({ x: i, y: figure.y });
      }
    };

    const checkDiagonal = (): void => {
      // top right
      for (let i = 1; i <= 8; i++) {
        if (!checkCellForMove(figure.x + i, figure.y + i)) break;
      }
      // bottom right
      for (let i = 1; i <= 8; i++) {
        if (!checkCellForMove(figure.x + i, figure.y - i)) break;
      }
      // bottom left
      for (let i = 1; i <= 8; i++) {
        if (!checkCellForMove(figure.x - i, figure.y - i)) break;
      }
      for (let i = 1; i <= 8; i++) {
        if (!checkCellForMove(figure.x - i, figure.y + i)) break;
      }
    };

    const checkEatableFiguresByDiagonal = (): void => {
      for (let i = 1; i <= 8; i++) {
        if (checkEatableOrAlliesCell(figure.x + i, figure.y + i)) break;
      }
      // bottom right
      for (let i = 1; i <= 8; i++) {
        if (checkEatableOrAlliesCell(figure.x + i, figure.y - i)) break;
      }
      // bottom left
      for (let i = 1; i <= 8; i++) {
        if (checkEatableOrAlliesCell(figure.x - i, figure.y - i)) break;
      }
      for (let i = 1; i <= 8; i++) {
        if (checkEatableOrAlliesCell(figure.x - i, figure.y + i)) break;
      }
    };

    const isEatableCell = (x: number, y: number): boolean => {
      return cellsFigure[`${x}-${y}`] != null && figure.color !== cellsFigure[`${x}-${y}`]?.color;
    };

    const checkEatableCell = (x: number, y: number): boolean => {
      if (isEatableCell(x, y)) {
        way.push({ x, y });
        return true;
      }
      return false;
    };

    const checkEatableOrAlliesCell = (x: number, y: number): boolean => {
      if (cellsFigure[`${x}-${y}`] != null && cellsFigure[`${x}-${y}`]?.color === figure.color)
        return true;
      if (isEatableCell(x, y)) {
        way.push({ x, y });
        return true;
      }
      return false;
    };

    // PAWN
    const checkEatableFiguresByPawn = (): void => {
      if (figure.color === Colors.BLACK) {
        checkEatableCell(figure.x - 1, figure.y - 1);
        checkEatableCell(figure.x + 1, figure.y - 1);
      } else {
        checkEatableCell(figure.x - 1, figure.y + 1);
        checkEatableCell(figure.x + 1, figure.y + 1);
      }
    };

    if (figure.name === FigureEnum.PAWN) {
      if (figure.color === Colors.BLACK) {
        if (!isForDangerousCells) {
          verticalBottom(figure.y - 2);
        } else {
          way.push({ y: figure.y - 1, x: figure.x - 1 });
          way.push({ y: figure.y - 1, x: figure.x + 1 });
        }
      }
      if (figure.color === Colors.WHITE) {
        if (!isForDangerousCells) {
          verticalTop(figure.y + 2);
        } else {
          way.push({ y: figure.y + 1, x: figure.x - 1 });
          way.push({ y: figure.y + 1, x: figure.x + 1 });
        }
      }
      checkEatableFiguresByPawn();
    }

    // ROOK
    const checkEatableFiguresByRook = (): void => {
      // check top
      for (let i = figure.y + 1; i <= 8; i++) {
        if (checkEatableOrAlliesCell(figure.x, i)) break;
      }
      // check bottom
      for (let i = figure.y - 1; i >= 0; i--) {
        if (checkEatableOrAlliesCell(figure.x, i)) break;
      }
      // check left
      for (let i = figure.x - 1; i >= 0; i--) {
        if (checkEatableOrAlliesCell(i, figure.y)) break;
      }
      // check right
      for (let i = figure.x + 1; i <= 8; i++) {
        if (checkEatableOrAlliesCell(i, figure.y)) break;
      }
    };

    if (figure.name === FigureEnum.ROOK) {
      verticalBottom(0);
      verticalTop(8);
      horizontalLeft(0);
      horizontalRight(8);
      checkEatableFiguresByRook();
    }

    // KNIGHT
    const checkMovesByKnight = (): void => {
      checkCellForMove(figure.x + 1, figure.y + 2);
      checkCellForMove(figure.x - 1, figure.y + 2);
      checkCellForMove(figure.x + 2, figure.y + 1);
      checkCellForMove(figure.x + 2, figure.y - 1);
      checkCellForMove(figure.x + 1, figure.y - 2);
      checkCellForMove(figure.x - 1, figure.y - 2);
      checkCellForMove(figure.x - 2, figure.y - 1);
      checkCellForMove(figure.x - 2, figure.y + 1);
    };

    const checkEatableFiguresByKnight = (): void => {
      checkEatableOrAlliesCell(figure.x + 1, figure.y + 2);
      checkEatableOrAlliesCell(figure.x - 1, figure.y + 2);
      checkEatableOrAlliesCell(figure.x + 2, figure.y + 1);
      checkEatableOrAlliesCell(figure.x + 2, figure.y - 1);
      checkEatableOrAlliesCell(figure.x + 1, figure.y - 2);
      checkEatableOrAlliesCell(figure.x - 1, figure.y - 2);
      checkEatableOrAlliesCell(figure.x - 2, figure.y - 1);
      checkEatableOrAlliesCell(figure.x - 2, figure.y + 1);
    };

    if (figure.name === FigureEnum.KNIGHT) {
      checkMovesByKnight();
      checkEatableFiguresByKnight();
    }

    // BISHOP
    if (figure.name === FigureEnum.BISHOP) {
      checkDiagonal();
      checkEatableFiguresByDiagonal();
    }

    // QUEEN
    if (figure.name === FigureEnum.QUEEN) {
      checkDiagonal();
      checkEatableFiguresByDiagonal();
      verticalBottom(0);
      verticalTop(8);
      horizontalLeft(0);
      horizontalRight(8);
      checkEatableFiguresByRook();
    }

    // KING
    const checkKingDiagonal = (): void => {
      checkCellForMove(figure.x + 1, figure.y + 1);
      checkCellForMove(figure.x + 1, figure.y - 1);
      checkCellForMove(figure.x - 1, figure.y - 1);
      checkCellForMove(figure.x - 1, figure.y + 1);
    };

    const checkEatableFiguresByKing = (): void => {
      checkEatableOrAlliesCell(figure.x + 1, figure.y + 1);
      checkEatableOrAlliesCell(figure.x + 1, figure.y - 1);
      checkEatableOrAlliesCell(figure.x - 1, figure.y - 1);
      checkEatableOrAlliesCell(figure.x - 1, figure.y + 1);
      checkEatableOrAlliesCell(figure.x + 1, figure.y);
      checkEatableOrAlliesCell(figure.x - 1, figure.y);
      checkEatableOrAlliesCell(figure.x, figure.y + 1);
      checkEatableOrAlliesCell(figure.x, figure.y - 1);
    };

    if (figure.name === FigureEnum.KING) {
      verticalBottom(figure.y - 1);
      verticalTop(figure.y + 1);
      horizontalLeft(figure.x - 1);
      horizontalRight(figure.x + 1);
      checkKingDiagonal();
      checkEatableFiguresByKing();

      const cellsForRemoving: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < way.length; i++) {
        if (dangerousCells.current[getOtherColor(figure.color)][`${way[i].x}-${way[i].y}`]) {
          cellsForRemoving.push({ x: way[i].x, y: way[i].y });
        }
      }
      cellsForRemoving.forEach((elw) => {
        way = way.filter((el) => !(el.y === elw.y && el.x === elw.x));
      });
    }

    const obj: { [key: string]: boolean } = {};
    way.forEach((el) => {
      obj[`${el.x}-${el.y}`] = true;
    });
    return obj;
  };

  const endGame = (winner: Colors): void => {
    dispatch(setGameWon(winner));
    dispatch(setGameStarted(false));
  };

  const eatFigure = (figure: FigureData): void => {
    cellsFigure[`${figure.x}-${figure.y}`] = null;
    if (figure.name === FigureEnum.KING) {
      endGame(getOtherColor(figure.color));
    }
    dispatch(removeFigure(figure));
  };

  const moveOrEat = (figure: FigureData, x: number, y: number): void => {
    const figureOnCell = cellsFigure[`${x}-${y}`];
    if (figureOnCell != null && figureOnCell.color !== figure.color) eatFigure(figureOnCell);
    moveOn(figure, x, y);
  };

  const nextAIMove = (): void => {
    const getRandomElementOfArray = <T extends unknown>(arr: T[]): T => {
      return arr[Math.floor(Math.random() * arr.length)];
    };

    const figuresIds = Object.keys(figures);
    if (figuresIds.length < 1) return;
    const enemyFiguresIds = figuresIds.filter((id) => figures[id].color === sides.enemy);
    let randomFigureId = getRandomElementOfArray(enemyFiguresIds);
    let availableCells = getAvailableCells(figures[randomFigureId]);
    let availableCellsArr = Object.keys(availableCells);
    const triedFiguresIds: string[] = [];
    while (availableCellsArr.length < 1) {
      if (triedFiguresIds.length >= enemyFiguresIds.length) return;
      randomFigureId = getRandomElementOfArray(enemyFiguresIds);
      availableCells = getAvailableCells(figures[randomFigureId]);
      availableCellsArr = Object.keys(availableCells);
      triedFiguresIds.push(randomFigureId);
    }
    const cellForMove = getRandomElementOfArray(availableCellsArr);
    const [x, y] = cellForMove.split('-');
    moveOrEat(figures[randomFigureId], Number(x), Number(y));
  };

  const scheduleNextAIMove = (delay: number = 200): void => {
    setTimeout(nextAIMove, delay);
  };

  const cellClicked = (x: number, y: number): void => {
    if (choseFigurePos == null) return;
    if (!choseFigurePos.availableCells[`${x}-${y}`]) return;

    moveOn(choseFigurePos.figure, x, y);
    scheduleNextAIMove();
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

  const figureClicked = (figure: FigureData): void => {
    if (
      choseFigurePos?.availableCells[`${figure.x}-${figure.y}`] !== undefined &&
      choseFigurePos.figure.color !== figure.color
    ) {
      moveOrEat(choseFigurePos.figure, figure.x, figure.y);
      scheduleNextAIMove();
      return;
    }

    if (
      choseFigurePos != null &&
      choseFigurePos.figure.name === figure.name &&
      figure.x === choseFigurePos.figure.x &&
      choseFigurePos.figure.y === figure.y &&
      choseFigurePos.figure.color === figure.color
    ) {
      setChoseFigurePos(null);
      return;
    }

    if (sides.ally !== figure.color) return;

    if (isKingInCheck && figure.name !== FigureEnum.KING) return;

    setChoseFigurePos({
      figure,
      availableCells: getAvailableCells(figure),
    });
  };

  const initFigures = (): React.ReactElement[] => {
    const figuresJSX: React.ReactElement[] = [];

    for (const item in figures) {
      cellsFigure[`${figures[item].x}-${figures[item].y}`] = figures[item];
      figuresJSX.push(
        <Figure
          key={figures[item].id}
          figure={figures[item]}
          figureClicked={figureClicked}
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
