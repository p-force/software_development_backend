export function isLimit(limit: string, maxLimit: number) {
  const lim = Number(limit);
  return !isNaN(lim) && lim >= 1 && lim <= maxLimit;
}
