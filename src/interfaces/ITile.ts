import Piece from "../models/Piece";

interface ITile {
  id: string;
  piece?: Piece;
  attackedBy?: string[];
  ableToMove?: boolean;
}

export default ITile;