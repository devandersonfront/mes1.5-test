export const generateRandomString = () =>
  Math.random()
    .toString(20)
    .substr(2, 20);
