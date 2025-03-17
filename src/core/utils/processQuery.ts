export function processQuery(obj: any): string {
  let str = '';
  if (obj === null || obj === undefined) {
    return str;
  }
  str = '?';
  const keys = Object.keys(obj);
  keys.forEach((key, i) => {
    str += `${key}=${obj[key] == null ? '' : obj[key]}`;
    if (i !== keys.length - 1) {
      str += '&';
    }
  });
  return str;
}
