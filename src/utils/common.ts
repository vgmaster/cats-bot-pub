export const shuffleArray = <T>(array: T[]): T[] => {
  return array.sort(() => Math.round(Math.random() * 100) - 50);
};