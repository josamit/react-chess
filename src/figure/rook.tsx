import React, { FC, Fragment } from 'react';
import { Colors } from '../types/game';
import { figureColors } from '../constants';

interface Props {
  color: Colors;
}
const Rook: FC<Props> = ({ color }) => {
  return (
    <Fragment>
      <path
        d='M26 5C26.7286 5 27.4117 5.19479 28 5.53513C28.5883 5.19479 29.2714 5 30 5H41C41.7286 5 42.4117 5.19479 43 5.53513C43.5884 5.19479 44.2714 5 45 5H55C57.2091 5 59 6.79086 59 9V18C59 19.259 58.4072 20.4446 57.4 21.2L51.2279 25.8291L52.9755 41.5583C53.4382 45.7226 55.3765 47.8353 58.2 51.6C58.7193 52.2924 59 53.1345 59 54V62C59 64.2091 57.2091 66 55 66H16C13.7909 66 12 64.2091 12 62V54C12 53.1345 12.2807 52.2924 12.8 51.6C15.6235 47.8353 17.5618 45.7226 18.0245 41.5583L19.7722 25.8291L13.6 21.2C12.5928 20.4446 12 19.259 12 18V9C12 6.79086 13.7909 5 16 5H26Z'
        fill={color === Colors.BLACK ? figureColors.light : figureColors.dark}
      />
      <path
        d='M16 9H26V15H30V9H41V15H45V9H55V18L47 24L49 42H22L24 24L16 18V9Z'
        fill={color === Colors.BLACK ? figureColors.dark : figureColors.light}
      />
      <path
        d='M22 46H49L55 54V62H16V54L22 46Z'
        fill={color === Colors.BLACK ? figureColors.dark : figureColors.light}
      />
    </Fragment>
  );
};

export default Rook;
