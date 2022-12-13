import React, { FC } from 'react';
import styles from '../board/board.module.scss';
import classNames from 'classnames';
import { BoardNumberByLetter, Colors } from '../types/game';

interface Props {
  color: Colors;
  x: string;
  y: number;
  cellClicked: (x: number, y: number) => void;
  isAvailableForMove?: boolean;
  isHavingFigure?: boolean;
  isSelected?: boolean;
}
const Cell: FC<Props> = (props) => {
  const cellClassName = classNames(styles.cell, {
    [styles.cellWhite]: props.color === Colors.WHITE,
    [styles.cellBlack]: props.color === Colors.BLACK,
    [styles.availableCell]: props?.isAvailableForMove === true && props?.isHavingFigure !== null,
    [styles.cellSelected]: props.isSelected,
  });

  const cellContentClassName = classNames(styles.cellCircle, {
    [styles.cellCircleShow]: props?.isAvailableForMove === true && props?.isHavingFigure !== null,
  });

  return (
    <li
      onClick={() => props.cellClicked(BoardNumberByLetter[props.x], props.y)}
      id={`cell-${props.x}-${props.y}`}
      className={cellClassName}
    >
      <div className={cellContentClassName}></div>
    </li>
  );
};

export default Cell;
