import getTile from "../../helpers/getTile";
import ITile from "../../interfaces/ITile";
import Piece from "../Piece";

export default class Pawn extends Piece {
  constructor(color: "white" | "black") {
    let img = `/images/pawn_${color}.png`;
    super(img, color);
  }

  /**
   *
   * @param position {string} id de la casilla donde se encuentra (Ejemplo: b5)
   * @returns {string[]} Casillas atacadas por la pieza desde la posicion actual (Ejemplo: ['c4', 'c6'])
   */
  public attackingTiles(): string[] {
    let row = this.position[0];
    let col = Number(this.position[1]);
    let newRow =
      this.letters[
        this.letters.findIndex((letter) => letter === row) - (this.color === "white" ? 1 : -1)
      ];
    return [`${newRow}${col - 1}`, `${newRow}${col + 1}`];
  }

  public getTilesToMove(boardState: ITile[][]): string[] {
    let row = this.position[0];
    let col = Number(this.position[1]);
    let newRow =
      this.letters.findIndex((letter) => letter === row) - (this.color === "white" ? 1 : -1);
    let tiles = [`${this.letters[newRow]}${col}`];
    if (!this.alreadyMoved) {
      let secondTile = getTile(boardState, `${this.letters[newRow]}${col}`);
      if (secondTile && !secondTile.piece)
        tiles.push(`${this.letters[newRow - (this.color === "white" ? 1 : -1)]}${col}`);
    }
    return tiles;
  }
}
