/** The only site the extension links to. */
const RESKINS_ORIGIN = 'https://reskins.gg';

/** Query parameter the site reads the whole item from; it finds the item page by itself. */
const ITEM_PARAM = 'i';

/** English lives at the site root, Russian under its prefix. */
const ENGLISH_SITE_PATH = '/';
const RUSSIAN_SITE_PATH = '/ru';

/** Browser UI language tags of Russian: `ru`, `ru-RU`, `ru_RU`. */
const RUSSIAN_LANGUAGE_PATTERN = /^ru(?:[-_]|$)/i;

/** Item hex from an Inspect in Game link -> its page on reskins.gg in the browser's language. */
export function buildReskinsItemUrl(inspectLinkHex: string, uiLanguage: string): string {
  const sitePath = RUSSIAN_LANGUAGE_PATTERN.test(uiLanguage) ? RUSSIAN_SITE_PATH : ENGLISH_SITE_PATH;
  const reskinsItemUrl = new URL(sitePath, RESKINS_ORIGIN);
  reskinsItemUrl.searchParams.set(ITEM_PARAM, inspectLinkHex);
  return reskinsItemUrl.href;
}
