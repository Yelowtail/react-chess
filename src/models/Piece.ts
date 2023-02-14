import ITile from "../interfaces/ITile";

export default class Piece {
  protected letters = ["h", "g", "f", "e", "d", "c", "b", "a"];

  protected _position: string = "";
  public get position(): string {
    return this._position;
  }
  
  public set position(value: string) {
    if(this.position) this.alreadyMoved = true;
    this._position = value;
  }
  
  public alreadyMoved: boolean = false;
  public constructor(public image: string, public color: "white" | "black") {}
  public attackingTiles(): string[] {
    return [this.position];
  }
  public getTilesToMove(boardState?: ITile[][]): string[] {
    return [this.position];
  }
}
