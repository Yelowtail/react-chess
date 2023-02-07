import ITile from "../interfaces/ITile";
import Piece from "../models/Piece";
import cloneMatrix from "./cloneMatrix";
import getTile from "./getTile";

/**
 * Coloca una puieza en el tablero y retorna el nuevo estado del mismo
 * @param board  {ITile[][]}   Tablero en el que se colocará la pieza
 * @param piece  {Piece}       Pieza a colocar en el tablero
 * @param tileId {string}      id de la casilla donde colocar la pieza (Por ejemplo d6)
 * @return       {ITile[][]}   Nuevo estado del tablero con la pieza colocada
 */
export const placePiece = (board: ITile[][], piece: Piece, tileId: string) => {
  let newBoardState = cloneMatrix(board);
  let tile = getTile(newBoardState, tileId);

  if (tile) {
    piece.position = tileId;
    tile.piece = piece;
    let attackedTiles = piece.attackingTiles();
    attackedTiles.forEach((x) => {
      let tile = getTile(newBoardState, x);
      if (tile) {
        if (!tile.attackedBy) tile.attackedBy = [];
        !tile.attackedBy.includes(tileId) && tile.attackedBy.push(tileId);
      }
    });
  }
  return newBoardState;
};

export const removePiece = (board: ITile[][], piece: Piece) => {
  let newBoardState = cloneMatrix(board);
  let tile = getTile(newBoardState, piece.position);
  if (tile) {
    let attackedTiles = piece.attackingTiles();
    attackedTiles.forEach((x) => {
      let attackedTile = getTile(newBoardState, x);
      if(attackedTile) attackedTile.attackedBy = attackedTile.attackedBy?.filter(t => {
        return t !== piece.position
      })
    })
    tile.piece = undefined
  };
  return newBoardState;
};

export const movePiece = (board: ITile[][], piece: Piece, to: string) => {
  let newBoard = removePiece(board, piece);
  piece.position = to;
  placePiece(newBoard, piece, to);
  return newBoard;
};

const updateAttakedTiles = (board: ITile[][]) => {
  board.forEach((row:ITile[]) => {
    row.forEach((tile: ITile) => {
      tile.attackedBy = []
      tile.piece?.attackingTiles().forEach((t) => {
        let attackedTile = getTile(board, t)
        if (attackedTile){
          if(!attackedTile.attackedBy) attackedTile.attackedBy = []
          attackedTile.attackedBy.push(tile.id)
        } 
      })
    })
  })
}