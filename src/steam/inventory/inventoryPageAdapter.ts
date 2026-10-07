import { INSPECT_LINK_SELECTOR } from '../inspectLinkSelector';
import type { SteamPageAdapter } from '../types';

/** Info panels of the selected item: Steam alternates the two on every selection. */
const ITEM_INFO_PANEL_SELECTORS = ['#iteminfo0', '#iteminfo1'];

/** Right column of the inventory: extensions like MarketApp hide Steam's panels and draw their own item panel here. */
const INVENTORY_RIGHT_COLUMN_SELECTOR = '.inventory_page_right';

const INVENTORY_INSPECT_LINK_SELECTOR = [...ITEM_INFO_PANEL_SELECTORS, INVENTORY_RIGHT_COLUMN_SELECTOR]
  .map((containerSelector) => `${containerSelector} ${INSPECT_LINK_SELECTOR}`)
  .join(', ');

export const inventoryPageAdapter: SteamPageAdapter = {
  findInspectLinks: () => [...document.querySelectorAll<HTMLAnchorElement>(INVENTORY_INSPECT_LINK_SELECTOR)],
  // Steam's link sits in a flex row with a gap, MarketApp's in a column of buttons: right after it fits both
  mountInspectAction: (inspectLink, inspectAction) => {
    inspectLink.after(inspectAction);
  },
};
