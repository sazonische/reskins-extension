import { browser } from 'wxt/browser';
import { parseInspectLinkHex } from '../inspect/parseInspectLinkHex';
import { buildReskinsEmbedUrl, buildReskinsItemUrl } from '../site/reskinsUrls';
import { observeSteamPage } from '../steam/observeSteamPage';
import type { SteamPageAdapter } from '../steam/types';
import { closeItemViewerWindow } from './itemViewerWindow';
import { createOpenIn3dAction, matchSteamLinkLook } from './openIn3dAction';
import { closeOpenIn3dMenu } from './openIn3dMenu';

/** Set on a processed Steam link: the hex its action was built for. */
const INSPECT_HEX_ATTRIBUTE = 'data-reskins-inspect-hex';

const mountedActionsByInspectLink = new WeakMap<HTMLAnchorElement, HTMLElement>();

/** Keeps "Open in 3D" next to every Inspect in Game link of the page; returns the function that stops it. */
export function mountOpenIn3dActions(steamPageAdapter: SteamPageAdapter): () => void {
  const stopObservingPage = observeSteamPage(() => {
    for (const inspectLink of steamPageAdapter.findInspectLinks()) {
      syncOpenIn3dAction(steamPageAdapter, inspectLink);
    }
  });
  return () => {
    stopObservingPage();
    // an updated or removed extension leaves no menu or window on the page
    closeOpenIn3dMenu();
    closeItemViewerWindow();
  };
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

  const uiLanguage = browser.i18n.getUILanguage();
  const openIn3dAction = createOpenIn3dAction({
    itemPageUrl: buildReskinsItemUrl(inspectLinkHex, uiLanguage),
    buildViewerFrameUrl: (viewerLook) => buildReskinsEmbedUrl(inspectLinkHex, uiLanguage, viewerLook),
    findItemName: () => steamPageAdapter.findItemName(inspectLink),
  });
  steamPageAdapter.mountInspectAction(inspectLink, openIn3dAction);
  matchSteamLinkLook(openIn3dAction, inspectLink);
  inspectLink.setAttribute(INSPECT_HEX_ATTRIBUTE, inspectLinkHex);
  mountedActionsByInspectLink.set(inspectLink, openIn3dAction);
}
