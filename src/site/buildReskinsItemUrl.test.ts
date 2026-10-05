import { buildReskinsItemUrl } from './buildReskinsItemUrl';

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
