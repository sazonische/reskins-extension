import { INSPECT_LINK_SELECTOR } from '../inspectLinkSelector';
import type { SteamPageAdapter } from '../types';

/** Classic market: every listing row in the results carries its own link. */
const LISTING_ROWS_SELECTOR = '#searchResultsRows';

/** New market: cards have no link, it appears in the dialog that opens from a card. */
const LISTING_DIALOG_SELECTOR = 'dialog';

const MARKET_INSPECT_LINK_SELECTOR = [LISTING_ROWS_SELECTOR, LISTING_DIALOG_SELECTOR]
  .map((containerSelector) => `${containerSelector} ${INSPECT_LINK_SELECTOR}`)
  .join(', ');

export const marketPageAdapter: SteamPageAdapter = {
  findInspectLinks: () => [...document.querySelectorAll<HTMLAnchorElement>(MARKET_INSPECT_LINK_SELECTOR)],
  // right after the link fits both the flex row of the dialog and the text block of the classic row
  mountInspectAction: (inspectLink, inspectAction) => {
    inspectLink.after(inspectAction);
  },
};
