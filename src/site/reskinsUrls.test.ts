import { buildReskinsEmbedUrl, buildReskinsItemUrl } from './reskinsUrls';

const INSPECT_LINK_HEX = 'D3C37470104F1AD2CB18D9F3D3FBD0E3D7BB02D2A3D371D2DBDBD3C3DB832D4CD672F8795A';

describe('buildReskinsItemUrl', () => {
  test('opens the English site at the root', () => {
    expect(buildReskinsItemUrl(INSPECT_LINK_HEX, 'en-US')).toBe(`https://reskins.gg/?i=${INSPECT_LINK_HEX}`);
  });

  test('opens the Russian site for every Russian language tag', () => {
    for (const russianLanguage of ['ru', 'ru-RU', 'ru_RU', 'RU']) {
      expect(buildReskinsItemUrl(INSPECT_LINK_HEX, russianLanguage)).toBe(`https://reskins.gg/ru?i=${INSPECT_LINK_HEX}`);
    }
  });

  test('falls back to English for languages the site does not have', () => {
    expect(buildReskinsItemUrl(INSPECT_LINK_HEX, 'de')).toBe(`https://reskins.gg/?i=${INSPECT_LINK_HEX}`);
    expect(buildReskinsItemUrl(INSPECT_LINK_HEX, 'rue')).toBe(`https://reskins.gg/?i=${INSPECT_LINK_HEX}`);
  });
});

describe('buildReskinsEmbedUrl', () => {
  const STARTING_LOOK = { isOriginalTextures: false, isFirstPersonView: false };
  const FULL_VOLUME = 1;
  const HIDDEN_BUTTONS = 'textures_button=0&hands_button=0';

  test('frames the English viewer under the embed path, without its own texture and view buttons', () => {
    expect(buildReskinsEmbedUrl(INSPECT_LINK_HEX, 'en-US', STARTING_LOOK, FULL_VOLUME)).toBe(`https://reskins.gg/embed/${INSPECT_LINK_HEX}?${HIDDEN_BUTTONS}`);
  });

  test('frames the Russian viewer for every Russian language tag', () => {
    for (const russianLanguage of ['ru', 'ru-RU', 'ru_RU', 'RU']) {
      expect(buildReskinsEmbedUrl(INSPECT_LINK_HEX, russianLanguage, STARTING_LOOK, FULL_VOLUME)).toBe(`https://reskins.gg/ru/embed/${INSPECT_LINK_HEX}?${HIDDEN_BUTTONS}`);
    }
  });

  test('falls back to the English viewer for languages the site does not have', () => {
    expect(buildReskinsEmbedUrl(INSPECT_LINK_HEX, 'rue', STARTING_LOOK, FULL_VOLUME)).toBe(`https://reskins.gg/embed/${INSPECT_LINK_HEX}?${HIDDEN_BUTTONS}`);
  });

  test('asks for the original textures and the first-person view the window switches to', () => {
    expect(buildReskinsEmbedUrl(INSPECT_LINK_HEX, 'ru', { isOriginalTextures: true, isFirstPersonView: false }, FULL_VOLUME))
      .toBe(`https://reskins.gg/ru/embed/${INSPECT_LINK_HEX}?${HIDDEN_BUTTONS}&textures=original`);
    expect(buildReskinsEmbedUrl(INSPECT_LINK_HEX, 'ru', { isOriginalTextures: true, isFirstPersonView: true }, FULL_VOLUME))
      .toBe(`https://reskins.gg/ru/embed/${INSPECT_LINK_HEX}?${HIDDEN_BUTTONS}&textures=original&view=hands`);
  });

  test('starts a new frame at the window volume, and silent when the sound is off', () => {
    expect(buildReskinsEmbedUrl(INSPECT_LINK_HEX, 'en', { isOriginalTextures: false, isFirstPersonView: true }, 0.35))
      .toBe(`https://reskins.gg/embed/${INSPECT_LINK_HEX}?${HIDDEN_BUTTONS}&view=hands&volume=0.35`);
    expect(buildReskinsEmbedUrl(INSPECT_LINK_HEX, 'en', STARTING_LOOK, 0))
      .toBe(`https://reskins.gg/embed/${INSPECT_LINK_HEX}?${HIDDEN_BUTTONS}&volume=0`);
  });
});
