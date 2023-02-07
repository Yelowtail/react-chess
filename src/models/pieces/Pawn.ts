import Piece from "../Piece";

export default class Pawn extends Piece {
  public image: string;
  public alreadyMoved: boolean = false;
  constructor(color: "white" | "black") {
    let img = `/images/pawn_${color}.png`;
    super(img, color);
    this.image = img;
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

  public getTilesToMove(): string[] {
    let row = this.position[0];
    let col = Number(this.position[1]);
    let newRow =
      this.letters[
        this.letters.findIndex((letter) => letter === row) - (this.color === "white" ? 1 : -1)
      ];
    return [`${newRow}${col}`];
  }
}
