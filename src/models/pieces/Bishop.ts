import getTile from "../../helpers/getTile";
import ITile from "../../interfaces/ITile";
import Piece from "../Piece";

export default class Bishop extends Piece {
  public image: string;
  public alreadyMoved: boolean = false;

  public get position(): string {
    return this._position;
  }

  public set position(value: string) {
    this._position = value;
  }

  constructor(color: "white" | "black") {
    let img = `/images/bishop_${color}.png`;
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
    let tiles = [];
    for (let i = 0; i < 8; i++) {
      row + i < 8 && col + i <= 8 && tiles.push(`${this.letters[row + i]}${col + i}`);
      row + i < 8 && col - i <= 8 && col - i >= 0 && tiles.push(`${this.letters[row + i]}${col - i}`);
      row - i < 8 && row - i >= 0 && col + i <= 8 && tiles.push(`${this.letters[row - i]}${col + i}`);
      row - i < 8 && row - i >= 0 && col - i <= 8 && col - i >= 0 && tiles.push(`${this.letters[row - i]}${col - i}`);
    }
    return tiles;
  }

  public getTilesToMove(boardState?: ITile[][]): string[] {
    if (!boardState) return [];
    let row = this.letters.findIndex((letter) => letter === this.position[0]);
    let col = Number(this.position[1]);
    let tiles: string[] = [];
    let direction = 0;
    while (direction < 4) {
      let displacement = 1;
      while (displacement < 8) {
        let newRow = row + displacement * (1 - Number(direction >= 2) * 2);
        let newCol = col + displacement * (1 - Number(direction % 2 !== 0) * 2);
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
    return tiles;
  }
}
