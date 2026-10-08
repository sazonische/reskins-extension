import { INSPECT_LINK_SELECTOR } from '../inspectLinkSelector';
import { readSteamItemName } from '../readSteamItemName';
import type { SteamPageAdapter } from '../types';

/** Info panels of the selected item: Steam alternates the two on every selection. */
const ITEM_INFO_PANEL_SELECTORS = ['#iteminfo0', '#iteminfo1'];

/** Right column of the inventory: extensions like MarketApp hide Steam's panels and draw their own item panel here. */
const INVENTORY_RIGHT_COLUMN_SELECTOR = '.inventory_page_right';

/** Steam's item panel: its main heading is the item name. */
const PANEL_ITEM_NAME_SELECTOR = 'h1';

/** MarketApp's item panel: the title at its top. */
const MARKETAPP_ITEM_NAME_SELECTOR = '.text-lg.font-semibold';

const INVENTORY_INSPECT_LINK_SELECTOR = [...ITEM_INFO_PANEL_SELECTORS, INVENTORY_RIGHT_COLUMN_SELECTOR]
  .map((containerSelector) => `${containerSelector} ${INSPECT_LINK_SELECTOR}`)
  .join(', ');

export const inventoryPageAdapter: SteamPageAdapter = {
  findInspectLinks: () => [...document.querySelectorAll<HTMLAnchorElement>(INVENTORY_INSPECT_LINK_SELECTOR)],
  // Steam's link sits in a flex row with a gap, MarketApp's in a column of buttons: right after it fits both
  mountInspectAction: (inspectLink, inspectAction) => {
    inspectLink.after(inspectAction);
  },
  findItemName: (inspectLink) => {
    const itemInfoPanel = inspectLink.closest(ITEM_INFO_PANEL_SELECTORS.join(', '));
    if (itemInfoPanel !== null) return readSteamItemName(itemInfoPanel.querySelector(PANEL_ITEM_NAME_SELECTOR));
    const rightColumn = inspectLink.closest(INVENTORY_RIGHT_COLUMN_SELECTOR);
    if (rightColumn === null) return null;
    // the whole panel drawn into the column, searched from its top: the title comes before any other heading
    let itemPanel: Element = inspectLink;
    while (itemPanel.parentElement !== null && itemPanel.parentElement !== rightColumn) itemPanel = itemPanel.parentElement;
    return readSteamItemName(itemPanel.querySelector(MARKETAPP_ITEM_NAME_SELECTOR));
  },
};
