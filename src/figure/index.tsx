import React, { FC } from 'react';
import { FigureData } from '../types/game';
import styles from './figure.module.scss';
import classNames from 'classnames';
import { getFigure } from '../utils/figure';

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
        {getFigure(props.figure.name, props.figure.color)}
      </svg>
    </div>
  );
};

export default Figure;
