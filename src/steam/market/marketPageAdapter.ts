import { INSPECT_LINK_SELECTOR } from '../inspectLinkSelector';
import { readSteamItemName } from '../readSteamItemName';
import type { SteamPageAdapter } from '../types';

/** Classic market: every listing row in the results carries its own link. */
const LISTING_ROWS_SELECTOR = '#searchResultsRows';

/** New market: cards have no link, it appears in the dialog that opens from a card. */
const LISTING_DIALOG_SELECTOR = 'dialog';

/** Classic market: a listing row and its item name, coloured by rarity. */
const LISTING_ROW_SELECTOR = '.market_listing_row';
const ROW_ITEM_NAME_SELECTOR = '.market_listing_item_name';

/** New market: the heading of the listing dialog is the item name. */
const DIALOG_ITEM_NAME_SELECTOR = 'h2';

const MARKET_INSPECT_LINK_SELECTOR = [LISTING_ROWS_SELECTOR, LISTING_DIALOG_SELECTOR]
  .map((containerSelector) => `${containerSelector} ${INSPECT_LINK_SELECTOR}`)
  .join(', ');

export const marketPageAdapter: SteamPageAdapter = {
  findInspectLinks: () => [...document.querySelectorAll<HTMLAnchorElement>(MARKET_INSPECT_LINK_SELECTOR)],
  // right after the link fits both the flex row of the dialog and the text block of the classic row
  mountInspectAction: (inspectLink, inspectAction) => {
    inspectLink.after(inspectAction);
  },
  findItemName: (inspectLink) => {
    const listingRow = inspectLink.closest(LISTING_ROW_SELECTOR);
    if (listingRow !== null) return readSteamItemName(listingRow.querySelector(ROW_ITEM_NAME_SELECTOR));
    const listingDialog = inspectLink.closest(LISTING_DIALOG_SELECTOR);
    return readSteamItemName(listingDialog?.querySelector(DIALOG_ITEM_NAME_SELECTOR) ?? null);
  },
};
