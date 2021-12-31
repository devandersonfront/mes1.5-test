export const IdGenerator: (key: string) => string = (key) => {
  const RandomId = Math.random()*1000

  return `${key}-${RandomId}`
}
