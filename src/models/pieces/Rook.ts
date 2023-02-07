import getTile from "../../helpers/getTile";
import ITile from "../../interfaces/ITile";
import Piece from "../Piece";

export default class Rook extends Piece {
  public image: string;
  public alreadyMoved: boolean = false;

  public get position(): string {
    return this._position;
  }

  public set position(value: string) {
    this.chachedTilesToMove = [];
    this._position = value;
  }

  constructor(color: "white" | "black") {
    let img = `/images/rook_${color}.png`;
    super(img, color);
    this.image = img;
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
    for (let i = 1; i < 8; i++) {
      tiles.push(`${this.letters[row + i]}${col}`);
      tiles.push(`${this.letters[row - i]}${col}`);
      tiles.push(`${this.letters[row]}${col + i}`);
      tiles.push(`${this.letters[row]}${col - i}`);
    }
    return tiles;
  }

  private chachedTilesToMove: string[] = [];
  public getTilesToMove(boardState?: ITile[][]): string[] {
    if (this.chachedTilesToMove.length > 0) return this.chachedTilesToMove;
    if (!boardState) return [];
    let row = this.letters.findIndex((letter) => letter === this.position[0]);
    let col = Number(this.position[1]);
    let tiles: string[] = [];
    let direction = 0;
    while (direction < 4) {
      let displacement = 1;
      let rowMultiplier = 1 - Number(direction % 2 === 0 && direction >= 2) * 2 - Number(direction % 2 !== 0);
      let colMultiplier = 1 - Number(direction % 2 !== 0 && direction >= 2) * 2 - Number(direction % 2 === 0)
      while (displacement < 8) {
        let newRow = row + displacement * rowMultiplier;
        let newCol = col + displacement * colMultiplier;
        if (newRow < 8 && newCol <= 8 && newRow >= 0 && newCol >= 0) {
          let tile = getTile(boardState, `${this.letters[newRow]}${newCol}`);
          if (tile && tile.piece) {
            break;
          }
          tiles.push(`${this.letters[newRow]}${newCol}`);
        } else break;
        displacement++;
      }
      direction++;
    }
    this.chachedTilesToMove = tiles;
    return tiles;
  }
}
