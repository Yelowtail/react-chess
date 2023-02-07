import getTile from "../../helpers/getTile";
import ITile from "../../interfaces/ITile";
import Piece from "../Piece";

export default class King extends Piece {
  public image: string;
  public alreadyMoved: boolean = false;

  public get position(): string {
    return this._position;
  }

  public set position(value: string) {
    this._position = value;
  }

  constructor(color: "white" | "black") {
    let img = `/images/king_${color}.png`;
    super(img, color);
    this.image = img;
  }
  /**
   *
   * @param position {string} id de la casilla donde se encuentra (Ejemplo: b5)
   * @returns {string[]} Casillas atacadas por la pieza desde la posicion actual (Ejemplo: ['c4', 'c6'])
   */
  public attackingTiles(): string[] {
    return this.getAttakedTiles();
  }

  public getTilesToMove(boardState?: ITile[][]): string[] {
    if (!boardState) return [];
    return this.getAttakedTiles(boardState);
  }

  private getAttakedTiles(boardState?: ITile[][]) {
    let row = this.letters.findIndex((letter) => letter === this.position[0]);
    let col = Number(this.position[1]);
    let tiles: string[] = [];
    let direction = 1;
    while (direction <= 8) {
      let displacement = 1;
      let rowMultiplier = (1 - Number(direction > 4) * 2) * Number(direction % 4 !== 0);
      let colMultiplier =
        (1 - Number(direction >= 2 && direction <= 6) * 2) * Number(![2, 6].includes(direction));
      let newRow = row + displacement * rowMultiplier;
      let newCol = col + displacement * colMultiplier;

      direction++;
      if (newRow < 8 && newCol <= 8 && newRow >= 0 && newCol > 0) {
        if (boardState) {
          let tile = getTile(boardState, `${this.letters[newRow]}${newCol}`);
          if (tile) {
            if (tile.piece) continue;
            if (tile.attackedBy) {
              let ableToMove = true;
              for (const tileID of tile.attackedBy) {
                let attackedTile: ITile | null = getTile(boardState, tileID);
                if (attackedTile?.piece && (attackedTile.piece as Piece).color !== this.color) {
                  ableToMove = false;
                  break;
                }
              }
              if (!ableToMove) continue;
            }
          }
        }
        tiles.push(`${this.letters[newRow]}${newCol}`);
      }
    }
    return tiles;
  }
}
