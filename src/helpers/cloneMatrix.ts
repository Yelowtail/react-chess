export default <T>(matrix: T[][])  => {
  return matrix.map((x: T[]) => x.slice())
}