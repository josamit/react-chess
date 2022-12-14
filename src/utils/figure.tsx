import React from 'react';
import { Colors, Figure as FigureEnum } from '../types/game';
import Bishop from '../figure/bishop';
import King from '../figure/king';
import Knight from '../figure/knight';
import Pawn from '../figure/pawn';
import Queen from '../figure/queen';
import Rook from '../figure/rook';

export const getFigure = (figureName: string, color: Colors): React.ReactElement => {
  switch (figureName) {
    case FigureEnum.BISHOP:
      return <Bishop color={color} />;
    case FigureEnum.KING:
      return <King color={color} />;
    case FigureEnum.KNIGHT:
      return <Knight color={color} />;
    case FigureEnum.PAWN:
      return <Pawn color={color} />;
    case FigureEnum.QUEEN:
      return <Queen color={color} />;
    case FigureEnum.ROOK:
      return <Rook color={color} />;
    default:
      throw new Error('Not implemented!!');
  }
};
