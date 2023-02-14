import React, { useEffect, useState } from "react";
import cloneMatrix from "../../helpers/cloneMatrix";
import { movePiece, placePiece, removePiece } from "../../helpers/pieceHelper";
import useInitialChessState from "../../hooks/useInitialChessState";
import ITile from "../../interfaces/ITile";

import Piece from "../../models/Piece";
import Pawn from "../../models/pieces/Pawn";
import Bishop from "../../models/pieces/Bishop";
import Knight from "../../models/pieces/Knight";
import Rook from "../../models/pieces/Rook";
import Queen from "../../models/pieces/Queen";
import King from "../../models/pieces/King";

import "./ChessBoard.css";
import environment from "../../environment/environment";

const ChessBoard = () => {
  const {
    initialState: chessState,
    setInitialState: setChessState,
    getTile,
    pieces,
  } = useInitialChessState();

  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(count);
    console.table(pieces, ["image", "color", "_position"]);
    setCount((x) => x + 1);
  }, [pieces]);

  const [tileToEnPassant, setTileToEnPassant] = useState<string>();

  const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();

  const letters = ["h", "g", "f", "e", "d", "c", "b", "a"];
  const handleTileClick = (tileId: string) => {
    let tile = getTile(tileId);
    if (tile?.ableToMove && selectedPiece) {
      let newBoard = cloneMatrix(chessState);
      setTileToEnPassant("");
      if (selectedPiece instanceof Pawn) {
        enableEnPassant(tileId);
      }
      if (tile.piece) removePiece(newBoard, tile.piece);
      else if (tile.id === tileToEnPassant) {
        executeEnPassant(tileId);
      }
      movePiece(newBoard, selectedPiece, tile.id);
      setChessState(newBoard);
      setSelectedPiece(undefined);
    } else {
      let piece = tile?.piece;
      setSelectedPiece(piece);
    }
  };

  const enableEnPassant = (tileId: string) => {
    if (selectedPiece) {
      let colorMultiplier = selectedPiece.color === "white" ? 1 : -1;
      let newRowIndex = letters.findIndex((letter) => letter === tileId[0]) + 2 * colorMultiplier;
      if (letters[newRowIndex] === selectedPiece.position[0]) {
        setTileToEnPassant(
          `${letters[newRowIndex - 1 * colorMultiplier]}${selectedPiece.position[1]}`
        );
        console.log(`${letters[newRowIndex - 1 * colorMultiplier]}${selectedPiece.position[1]}`);
      }
    }
  };

  const executeEnPassant = (tileId: string) => {
    if (selectedPiece && tileToEnPassant) {
      let colorMultiplier = selectedPiece.color === "white" ? 1 : -1;
      let newRowIndex =
        letters.findIndex((letter) => letter === tileToEnPassant[0]) + 1 * colorMultiplier;
      let piece = getTile(`${letters[newRowIndex]}${tileId[1]}`)?.piece;
      piece && removePiece(chessState, piece);
    }
  };

  useEffect(() => {
    enableTilesToMove(selectedPiece);
  }, [selectedPiece]);

  const enableTilesToMove = (piece?: Piece) => {
    let board = cloneMatrix(chessState);
    let tilesToMove = piece?.getTilesToMove(chessState);
    let attackingTiles = piece?.attackingTiles();
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tilesToMove?.includes(tile.id)) {
          tile.ableToMove = !tile.piece;
        } else if (piece && attackingTiles?.includes(tile.id) && tile.piece) {
          tile.ableToMove = tile.piece.color !== piece.color;
        } else if (piece instanceof Pawn) {
          if (tile.id === tileToEnPassant) {
            console.log(tileToEnPassant);
          }
          tile.ableToMove = tile.id === tileToEnPassant && attackingTiles?.includes(tile.id);
        } else tile.ableToMove = undefined;
      });
    });
    setChessState(board);
  };

  return (
    <div className="board">
      {chessState.map((row) => {
        return row.map((tile: ITile) => (
          <div
            key={`tile-${tile.id}`}
            className={`tile ${tile.ableToMove && "hableToMove"}`}
            style={{
              backgroundColor:
                environment.debugger && tile.attackedBy && tile.attackedBy.length > 0
                  ? "#ff000040"
                  : "transparent",
            }}
            onClick={() => handleTileClick(tile.id)}
          >
            {tile.piece ? <img src={tile.piece?.image} /> : tile.id}
          </div>
        ));
      })}
    </div>
  );
};

export default ChessBoard;
