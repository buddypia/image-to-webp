export function findQuality(str) {
  const number = parseInt(str);
  if (typeof number == "number" && 1 <= number && number <= 100) return number;

  return 50;
}
