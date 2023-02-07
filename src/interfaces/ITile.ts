import Piece from "../models/Piece";

interface ITile {
  id: string;
  piece?: Piece;
  attackedBy?: string[];
  hableToMove?: boolean;
}

export default ITile;