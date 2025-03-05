/**
 * Returns a random number between the given range
 * @param to - The maximum number (exclusive)
 * @param from - The minimum number (inclusive)
 */
export const getRandomNumber = (to = 1_000_000_000_000_000, from = 0) => {
  const diff = to - from
  return Math.floor(Math.random() * diff) + from
}
