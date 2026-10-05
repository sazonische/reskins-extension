import { browser } from 'wxt/browser';
import { parseInspectLinkHex } from '../inspect/parseInspectLinkHex';
import { buildReskinsItemUrl } from '../site/buildReskinsItemUrl';
import { observeSteamPage } from '../steam/observeSteamPage';
import type { SteamPageAdapter } from '../steam/types';
import { createOpenIn3dAction, matchSteamLinkLook } from './openIn3dAction';

/** Set on a processed Steam link: the hex its action was built for. */
const INSPECT_HEX_ATTRIBUTE = 'data-reskins-inspect-hex';

const mountedActionsByInspectLink = new WeakMap<HTMLAnchorElement, HTMLElement>();

/** Keeps "Open in 3D" next to every Inspect in Game link of the page; returns the function that stops it. */
export function mountOpenIn3dActions(steamPageAdapter: SteamPageAdapter): () => void {
  return observeSteamPage(() => {
    for (const inspectLink of steamPageAdapter.findInspectLinks()) {
      syncOpenIn3dAction(steamPageAdapter, inspectLink);
    }
  });
}

function syncOpenIn3dAction(steamPageAdapter: SteamPageAdapter, inspectLink: HTMLAnchorElement): void {
  const inspectLinkHex = parseInspectLinkHex(inspectLink.getAttribute('href') ?? '');
  const mountedAction = mountedActionsByInspectLink.get(inspectLink);
  // Steam may keep the link element and swap its href, so the mark has to match the current hex
  const isActionCurrent = mountedAction?.isConnected === true
    && inspectLink.getAttribute(INSPECT_HEX_ATTRIBUTE) === inspectLinkHex;
  if (isActionCurrent) return;

  mountedAction?.remove();
  mountedActionsByInspectLink.delete(inspectLink);
  if (inspectLinkHex === null) {
    inspectLink.removeAttribute(INSPECT_HEX_ATTRIBUTE);
    return;
  }

  const openIn3dAction = createOpenIn3dAction(buildReskinsItemUrl(inspectLinkHex, browser.i18n.getUILanguage()));
  steamPageAdapter.mountInspectAction(inspectLink, openIn3dAction);
  matchSteamLinkLook(openIn3dAction, inspectLink);
  inspectLink.setAttribute(INSPECT_HEX_ATTRIBUTE, inspectLinkHex);
  mountedActionsByInspectLink.set(inspectLink, openIn3dAction);
}
