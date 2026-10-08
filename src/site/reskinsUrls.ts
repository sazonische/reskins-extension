/** The only site the extension links to. */
const RESKINS_ORIGIN = 'https://reskins.gg';

/** Query parameter the site reads the whole item from; it finds the item page by itself. */
const ITEM_PARAM = 'i';

/** Path of the 3D viewer alone: the only part of the site that lets other pages frame it. */
const EMBED_PATH = 'embed';

/** Viewer parameters: the game's own textures up to 4K instead of the light copies, and the first-person view. */
const EMBED_TEXTURES_PARAM = 'textures';
const EMBED_TEXTURES_ORIGINAL = 'original';
const EMBED_VIEW_PARAM = 'view';
const EMBED_VIEW_HANDS = 'hands';

/**
 * The viewer's own Original and first-person buttons hide: the window header carries both switches.
 * Original reloads the frame by itself, and Steam's `frame-src` lets a frame load only when the extension starts it.
 */
const EMBED_HIDDEN_BUTTON_PARAMS = ['textures_button', 'hands_button'];
const EMBED_BUTTON_HIDDEN = '0';

/** English lives at the site root, Russian under its prefix. */
const RUSSIAN_SITE_PREFIX = '/ru';

/** Browser UI language tags of Russian: `ru`, `ru-RU`, `ru_RU`. */
const RUSSIAN_LANGUAGE_PATTERN = /^ru(?:[-_]|$)/i;

/** How the viewer frame shows the item: which textures, and the item in hands or on its own. */
export interface ViewerLook {
  isOriginalTextures: boolean;
  isFirstPersonView: boolean;
}

function findSitePrefix(uiLanguage: string): string {
  return RUSSIAN_LANGUAGE_PATTERN.test(uiLanguage) ? RUSSIAN_SITE_PREFIX : '';
}

/** Item hex from an Inspect in Game link -> its page on reskins.gg in the browser's language. */
export function buildReskinsItemUrl(inspectLinkHex: string, uiLanguage: string): string {
  const reskinsItemUrl = new URL(findSitePrefix(uiLanguage) || '/', RESKINS_ORIGIN);
  reskinsItemUrl.searchParams.set(ITEM_PARAM, inspectLinkHex);
  return reskinsItemUrl.href;
}

/** Item hex -> the frame address of its 3D viewer in the browser's language, in the asked look. */
export function buildReskinsEmbedUrl(inspectLinkHex: string, uiLanguage: string, viewerLook: ViewerLook): string {
  const reskinsEmbedUrl = new URL(`${findSitePrefix(uiLanguage)}/${EMBED_PATH}/${inspectLinkHex}`, RESKINS_ORIGIN);
  for (const hiddenButtonParam of EMBED_HIDDEN_BUTTON_PARAMS) reskinsEmbedUrl.searchParams.set(hiddenButtonParam, EMBED_BUTTON_HIDDEN);
  if (viewerLook.isOriginalTextures) reskinsEmbedUrl.searchParams.set(EMBED_TEXTURES_PARAM, EMBED_TEXTURES_ORIGINAL);
  if (viewerLook.isFirstPersonView) reskinsEmbedUrl.searchParams.set(EMBED_VIEW_PARAM, EMBED_VIEW_HANDS);
  return reskinsEmbedUrl.href;
}
