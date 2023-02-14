import React, { useEffect, useState } from "react";
import ITile from "../interfaces/ITile";
import gt from "../helpers/getTile";
import Piece from "../models/Piece";
import cloneMatrix from "../helpers/cloneMatrix";
import { placePiece } from "../helpers/pieceHelper";
import Rook from "../models/pieces/Rook";
import Knight from "../models/pieces/Knight";
import Bishop from "../models/pieces/Bishop";
import Queen from "../models/pieces/Queen";
import King from "../models/pieces/King";
import Pawn from "../models/pieces/Pawn";
const useInitialChessState = (): {
  initialState: ITile[][];
  setInitialState: React.Dispatch<React.SetStateAction<ITile[][]>>;
  getTile: (id: string) => ITile | null;
  pieces: Piece[];
} => {
  const [initialState, setInitialState] = useState<Array<ITile[]>>(createInitialState());
  const [pieces, setPieces] = useState<Piece[]>([])
  useEffect(() => {
    const [board, initialPieces] = setPiecesInInitialState(initialState);
    setInitialState(board)
    setPieces(initialPieces)
  }, []);
  const getTile = (id: string): ITile | null => {
    return gt(initialState, id);
  };
  return { initialState, setInitialState, getTile, pieces };
};

const setPiecesInInitialState = (boardState: ITile[][]): [ITile[][], Piece[]] => {
  let pieces: Piece[] = [];
  boardState = cloneMatrix(boardState);
  boardState.forEach((row) => {
    let rowLetter = row[0].id[0];
    if (["a", "b", "g", "h"].includes(rowLetter)) {
      let color: "white" | "black" = rowLetter === "a" || rowLetter === "b" ? "white" : "black";
      row.forEach((tile) => {
        let tileNum = Number(tile.id[1]);
        let piece: Piece | undefined = undefined;
        if (rowLetter === "a" || rowLetter === "h") {
          switch (tileNum) {
            case 1:
            case 8:
              piece = new Rook(color);
              break;

            case 2:
            case 7:
              piece = new Knight(color);
              break;

            case 3:
            case 6:
              piece = new Bishop(color);
              break;

            case 4:
              piece = new Queen(color);
              break;

            case 5:
              piece = new King(color);
              break;

            default:
              break;
          }
        } else {
          piece = new Pawn(color);
        }

        if (piece) {
          pieces.push(piece);
          boardState = placePiece(boardState, piece, `${rowLetter}${tileNum}`);
        }
      });
    }
  });
  return [boardState, pieces];
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
