export const strictNumberRegEx = /^\d+$/;

export function isStrictNumber(text: string): boolean {
  return strictNumberRegEx.test(text);
}
