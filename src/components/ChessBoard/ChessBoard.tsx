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

const ChessBoard = () => {
  const {
    initialState: chessState,
    setInitialState: setChessState,
    getTile,
  } = useInitialChessState();

  useEffect(() => {
    let board = placePiece(chessState, new King("black"), "e4");
    // board = placePiece(chessState, new Bishop("black"), "a1");
    board = placePiece(chessState, new Pawn("white"), "c4");
    board = placePiece(chessState, new Pawn("white"), "d3");
    // let tile = getTile("e4");
    setChessState(board);
  }, []);

  const [selectedPiece, setSelectedPiece] = useState<Piece | undefined>();

  const handleTileClick = (tileId: string) => {
    let tile = getTile(tileId);
    if (tile?.hableToMove && selectedPiece) {
      let newBoard = cloneMatrix(chessState);
      if (tile.piece) removePiece(newBoard, tile.piece);
      movePiece(newBoard, selectedPiece, tile.id);
      setChessState(newBoard);
      setSelectedPiece(undefined);
    } else {
      let piece = tile?.piece;
      setSelectedPiece(piece);
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
          tile.hableToMove = !tile.piece || tile.piece.color !== piece?.color;
        } else if (piece && attackingTiles?.includes(tile.id) && tile.piece) {
          tile.hableToMove = tile.piece.color !== piece.color;
        } else tile.hableToMove = undefined;
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
            className={`tile ${tile.hableToMove && "hableToMove"}`}
            style={{
              backgroundColor:
                tile.attackedBy && tile.attackedBy.length > 0 ? "#ff000040" : "transparent",
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
