export const spaceRegEx = /\s+/g;

export function replaceSpacesFor(text: string, replaceChar: string): string {
  return text.replace(spaceRegEx, replaceChar);
}
