import React, { FC } from 'react';
import { FigureData, Figures } from '../types/game';
import Bishop from './bishop';
import King from './king';
import Knight from './knight';
import Pawn from './pawn';
import Queen from './queen';
import Rook from './rook';
import styles from './figure.module.scss';
import classNames from 'classnames';

interface Props {
  figure: FigureData;
  figureClicked: (figure: FigureData) => void;
  isSelected?: boolean;
  isEatable?: boolean;
}
const Figure: FC<Props> = (props) => {
  const position = {
    left: `${(props.figure.x - 1) * 12.5}%`,
    bottom: `${(props.figure.y - 1) * 12.5}%`,
  };

  const color = props.figure.color;

  const getFigure = (): React.ReactElement => {
    switch (props.figure.name) {
      case Figures.BISHOP:
        return <Bishop color={color} />;
      case Figures.KING:
        return <King color={color} />;
      case Figures.KNIGHT:
        return <Knight color={color} />;
      case Figures.PAWN:
        return <Pawn color={color} />;
      case Figures.QUEEN:
        return <Queen color={color} />;
      case Figures.ROOK:
        return <Rook color={color} />;
      default:
        throw new Error('Not implemented!!');
    }
  };

  return (
    <div
      onClick={() => props.figureClicked(props.figure)}
      className={classNames(styles.figure, {
        [styles.figureEatable]: props.isEatable,
      })}
      style={{ left: position.left, bottom: position.bottom }}
      id={props.figure.id}
    >
      <svg
        fill='none'
        width='100%'
        height='100%'
        viewBox='0 0 72 72'
        xmlns='http://www.w3.org/2000/svg'
      >
        {getFigure()}
      </svg>
    </div>
  );
};

export default Figure;
