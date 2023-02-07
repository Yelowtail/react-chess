import ITile from "../interfaces/ITile";

export default (board: ITile[][], id:string) => {
  let letter = id[0];
  let number = Number(id[1]);
  let row = board.find((row) => row[0].id.includes(letter));
  return (row && row[number-1]) || null;
};
