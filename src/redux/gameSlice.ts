import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Colors, FigureData } from '../types/game';
import { initialFigures } from '../constants';

interface Figures {
  [key: string]: FigureData;
}

export interface GameState {
  color: Colors;
  figures: Figures;
  gameWon: Colors | null;
  isGameStarted: boolean;
}

const initialState: GameState = {
  color: Colors.WHITE,
  figures: initialFigures,
  gameWon: null,
  isGameStarted: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setColor: (state, action: PayloadAction<Colors>) => {
      state.color = action.payload;
    },
    changeFigurePosition: (
      state,
      action: PayloadAction<{ figure: FigureData; x: number; y: number }>,
    ) => {
      state.figures[action.payload.figure.id].x = action.payload.x;
      state.figures[action.payload.figure.id].y = action.payload.y;
    },
    removeFigure: (state, action: PayloadAction<FigureData>) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state.figures[action.payload.id];
    },
    setGameWon: (state, action: PayloadAction<Colors>) => {
      state.gameWon = action.payload;
    },
    resetGame: (state) => {
      state.gameWon = initialState.gameWon;
      state.figures = initialState.figures;
      state.isGameStarted = false;
    },
    setGameStarted: (state, action: PayloadAction<boolean>) => {
      state.isGameStarted = action.payload;
    },
  },
});

export const {
  setColor,
  changeFigurePosition,
  removeFigure,
  setGameWon,
  resetGame,
  setGameStarted,
} = gameSlice.actions;

export default gameSlice.reducer;
