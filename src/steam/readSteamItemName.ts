import type { SteamItemName } from './types';

/** The name in an element Steam renders it in; the colour comes from the element holding the text itself. */
export function readSteamItemName(nameElement: Element | null): SteamItemName | null {
  if (nameElement === null) return null;
  const nameText = nameElement.textContent.trim();
  if (nameText === '') return null;
  // Steam may wrap the text in a span that carries the rarity colour
  const textWalker = document.createTreeWalker(nameElement, NodeFilter.SHOW_TEXT);
  let textHolder: Element = nameElement;
  for (let textNode = textWalker.nextNode(); textNode !== null; textNode = textWalker.nextNode()) {
    if (textNode.textContent?.trim() && textNode.parentElement) {
      textHolder = textNode.parentElement;
      break;
    }
  }
  return { text: nameText, color: getComputedStyle(textHolder).color };
}
