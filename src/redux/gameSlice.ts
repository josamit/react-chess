import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Colors, Figure, FigureData } from '../types/game';
import { initialFigures } from '../constants';

interface Figures {
  [key: string]: FigureData;
}

export interface History {
  figure: Figure;
  color: Colors;
  from: {
    x: number;
    y: number;
  };
  to: {
    x: number;
    y: number;
  };
  ateExistingPiece?: boolean;
}

export interface GameState {
  color: Colors;
  figures: Figures;
  gameWon: Colors | null;
  isGameStarted: boolean;
  history: History[];
}

const initialState: GameState = {
  color: Colors.WHITE,
  figures: initialFigures,
  gameWon: null,
  isGameStarted: false,
  history: [],
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
      const figure = state.figures[action.payload.figure.id];
      const payload = action.payload;

      const existingEntry = state.history.find(
        (item) => item.from.x === payload.x && item.from.y === payload.y,
      );

      if (existingEntry != null) {
        state.history.push({
          from: { x: figure.x, y: figure.y },
          to: { x: payload.x, y: payload.y },
          color: figure.color,
          figure: figure.name,
          ateExistingPiece: true,
        });
      } else {
        state.history.push({
          from: { x: figure.x, y: figure.y },
          to: { x: payload.x, y: payload.y },
          color: figure.color,
          figure: figure.name,
        });
      }

      figure.x = payload.x;
      figure.y = payload.y;
    },
    removeFigure: (state, action: PayloadAction<FigureData>) => {
      const figure = state.figures[action.payload.id];
      state.history.push({
        from: { x: figure.x, y: figure.y },
        to: { x: figure.x, y: figure.y },
        color: figure.color,
        figure: figure.name,
      });
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
