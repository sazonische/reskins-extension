import { parseInspectLinkHex } from './parseInspectLinkHex';

// Links taken from steamcommunity.com on 2026-10-06.
const MARKET_LISTING_HEX =
  '5C4C82B4CEA0945D445B7CC65E74596C5864BAE590A95F1CC0583E59545C4CDD753E59545D4CCD683E59545F4CA6723E48545E4CBA1E419FA9746361822E9F60195C48F0E034DFDCDCDC502C58273A7689';
const INVENTORY_ITEM_HEX = 'D3C37470104F1AD2CB18D9F3D3FBD0E3D7BB02D2A3D371D2DBDBD3C3DB832D4CD672F8795A';

describe('parseInspectLinkHex', () => {
  test('takes the hex from a market listing link', () => {
    expect(parseInspectLinkHex(`steam://run/730//+csgo_econ_action_preview%20${MARKET_LISTING_HEX}`))
      .toBe(MARKET_LISTING_HEX);
  });

  test('takes the hex from an inventory link', () => {
    expect(parseInspectLinkHex(`steam://run/730//+csgo_econ_action_preview%20${INVENTORY_ITEM_HEX}`))
      .toBe(INVENTORY_ITEM_HEX);
  });

  test('takes the hex from a rungame link with a plain space', () => {
    expect(parseInspectLinkHex(
      `steam://rungame/730/76561202255233023/+csgo_econ_action_preview ${INVENTORY_ITEM_HEX}`,
    )).toBe(INVENTORY_ITEM_HEX);
  });

  test('rejects the template Steam has not filled yet', () => {
    expect(parseInspectLinkHex('steam://run/730//+csgo_econ_action_preview%20%propid:6%')).toBeNull();
  });

  test('rejects old inventory and market links that only point at the item', () => {
    expect(parseInspectLinkHex(
      'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198000000000A40000000000D1234567890',
    )).toBeNull();
    expect(parseInspectLinkHex(
      'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20M551284815561799516A53964356651D1234567890',
    )).toBeNull();
  });

  test('rejects links without the inspect command or without an argument', () => {
    expect(parseInspectLinkHex('https://steamcommunity.com/market/')).toBeNull();
    expect(parseInspectLinkHex('steam://run/730//+csgo_econ_action_preview%20')).toBeNull();
  });

  test('rejects lowercase hex, which Steam never produces', () => {
    expect(parseInspectLinkHex(`steam://run/730//+csgo_econ_action_preview%20${INVENTORY_ITEM_HEX.toLowerCase()}`))
      .toBeNull();
  });
});
