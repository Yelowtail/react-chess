import getTile from "../../helpers/getTile";
import ITile from "../../interfaces/ITile";
import Piece from "../Piece";

export default class Knight extends Piece {
  public get position(): string {
    return this._position;
  }

  public set position(value: string) {
    this._position = value;
  }

  constructor(color: "white" | "black") {
    let img = `/images/knight_${color}.png`;
    super(img, color);
  }
  /**
   *
   * @param position {string} id de la casilla donde se encuentra (Ejemplo: b5)
   * @returns {string[]} Casillas atacadas por la pieza desde la posicion actual (Ejemplo: ['c4', 'c6'])
   */
  public attackingTiles(): string[] {
    let row = this.letters.findIndex((letter) => letter === this.position[0]);
    let col = Number(this.position[1]);
    let tiles: string[] = [];
    let direction = 0;
    while (direction < 4) {
      let rowMultiplier = 1 - Number(direction >= 2) * 2;
      let colMultiplier = 1 - Number(direction % 2 !== 0) * 2;
      let rowDisplacement = 2 - (1 - Number(direction % 2 !== 0));
      let colDisplacement =
        2 - (1 - Number(direction > 2 && direction < 3) - (1 - Number(direction % 2 !== 0)));
      if (row < 8 && col <= 8 && row >= 0 && col >= 0) {
        tiles.push(
          `${this.letters[row + rowDisplacement * rowMultiplier]}${
            col + colDisplacement * colMultiplier
          }`
        );
        tiles.push(
          `${this.letters[row + rowDisplacement * rowMultiplier]}${
            col - colDisplacement * colMultiplier
          }`
        );
      } else break;

      direction++;
    }
    return tiles;
  }

  public getTilesToMove(boardState?: ITile[][]): string[] {
    return this.attackingTiles();
  }
}
