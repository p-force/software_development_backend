export function isPage(page: string) {
  return !isNaN(Number(page)) && Number(page) > 0;
}
