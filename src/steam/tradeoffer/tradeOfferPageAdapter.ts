import { INSPECT_LINK_SELECTOR } from '../inspectLinkSelector';
import { readSteamItemName } from '../readSteamItemName';
import type { SteamPageAdapter } from '../types';

/** Item links of the action menu that the arrow on an item opens; Steam refills it on every opening. */
const ACTION_MENU_ITEM_LINKS_SELECTOR = '#trade_action_popup_itemactions';

/**
 * The menu has no name: the item tooltip has it as its main heading.
 * The tooltip keeps the item last under the pointer, the one whose arrow opened the menu.
 */
const TOOLTIP_ITEM_NAME_SELECTOR = '#hover_content h1';

const TRADE_OFFER_INSPECT_LINK_SELECTOR = `${ACTION_MENU_ITEM_LINKS_SELECTOR} ${INSPECT_LINK_SELECTOR}`;

export const tradeOfferPageAdapter: SteamPageAdapter = {
  findInspectLinks: () => [...document.querySelectorAll<HTMLAnchorElement>(TRADE_OFFER_INSPECT_LINK_SELECTOR)],
  // the menu stacks its links as rows: right after the link is the next row
  mountInspectAction: (inspectLink, inspectAction) => {
    inspectLink.after(inspectAction);
  },
  findItemName: () => readSteamItemName(document.querySelector(TOOLTIP_ITEM_NAME_SELECTOR)),
};
