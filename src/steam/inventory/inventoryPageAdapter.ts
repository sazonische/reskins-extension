import { INSPECT_LINK_SELECTOR } from '../inspectLinkSelector';
import type { SteamPageAdapter } from '../types';

/** Info panels of the selected item: Steam alternates the two on every selection. */
const ITEM_INFO_PANEL_SELECTORS = ['#iteminfo0', '#iteminfo1'];

const INVENTORY_INSPECT_LINK_SELECTOR = ITEM_INFO_PANEL_SELECTORS
  .map((panelSelector) => `${panelSelector} ${INSPECT_LINK_SELECTOR}`)
  .join(', ');

export const inventoryPageAdapter: SteamPageAdapter = {
  findInspectLinks: () => [...document.querySelectorAll<HTMLAnchorElement>(INVENTORY_INSPECT_LINK_SELECTOR)],
  // the link sits in a flex row with a gap, so the action lines up as Steam's next button
  mountInspectAction: (inspectLink, inspectAction) => {
    inspectLink.after(inspectAction);
  },
};
