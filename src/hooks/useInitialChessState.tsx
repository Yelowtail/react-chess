import React, { useEffect, useState } from "react";
import ITile from "../interfaces/ITile";
import gt from "../helpers/getTile";
const useInitialChessState = (): {
  initialState: ITile[][],
  setInitialState: React.Dispatch<React.SetStateAction<ITile[][]>>,
  getTile: (id: string) => ITile | null
} => {
  const [initialState, setInitialState] = useState<Array<ITile[]>>(createInitialState());

  const getTile = (id: string): ITile | null => {
    return gt(initialState, id)
  };
  return {initialState, setInitialState, getTile};
};

/**
 * Creates an initial state for the game
 * @returns {ITile[][]} Estado inicial del tablero
 */
const createInitialState = () => {
  let letters = ["h", "g", "f", "e", "d", "c", "b", "a"];
  let board: ITile[][] = [];
  board = letters.map((letter) => {
    let columns: ITile[] = [];
    for (let i = 1; i <= 8; i++) {
      columns.push({ id: `${letter}${i}` });
    }
    return columns;
  });
  return board;
};

export default useInitialChessState;
