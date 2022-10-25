export function regexEscape(str) {
  return str.replace(
    new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'),
    '\\$&',
  );
}
