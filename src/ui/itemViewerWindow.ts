import { browser } from 'wxt/browser';
import { createCloseIcon, createExternalLinkIcon } from './icons';
import itemViewerWindowCss from './itemViewerWindow.css?inline';
import { createSoundVolumeControl } from './soundVolumeControl';
import { buildSoundVolumeMessage, isReadyMessage } from '../site/reskinsEmbedMessages';
import { RESKINS_ORIGIN, type ViewerLook } from '../site/reskinsUrls';
import type { InspectActionTarget } from './types';

/** Marks our window in Steam's DOM; the look lives inside the shadow root. */
const WINDOW_HOST_CLASS = 'reskins-item-viewer';

let closeShownWindow: (() => void) | null = null;

/** Shows the item's 3D viewer in a window over the Steam page; the frame exists only while the window is open. */
export async function openItemViewerWindow(inspectActionTarget: InspectActionTarget, returnFocusElement: HTMLElement): Promise<void> {
  const soundVolumeControl = await createSoundVolumeControl((soundVolume) => {
    if (isViewerFrameListening) postSoundVolume(viewerFrame, soundVolume);
  });
  closeItemViewerWindow();

  const windowHost = document.createElement('div');
  windowHost.className = WINDOW_HOST_CLASS;
  // closed shadow root: Steam's CSS and scripts do not reach the window
  const windowShadowRoot = windowHost.attachShadow({ mode: 'closed' });
  const windowStyle = document.createElement('style');
  windowStyle.textContent = itemViewerWindowCss;

  // the name as Steam writes it next to the item, in Steam's colour for it
  const steamItemName = inspectActionTarget.findItemName();
  const itemName = document.createElement('h2');
  itemName.className = 'item-name';
  itemName.textContent = steamItemName?.text ?? browser.i18n.getMessage('itemViewerUnnamed');
  if (steamItemName) itemName.style.color = steamItemName.color;

  const editLink = document.createElement('a');
  editLink.className = 'steam-button';
  editLink.href = inspectActionTarget.itemPageUrl;
  editLink.target = '_blank';
  // the inventory address carries the Steam profile, the site does not need it
  editLink.rel = 'noopener noreferrer';
  const editLinkLabel = document.createElement('span');
  editLinkLabel.textContent = browser.i18n.getMessage('editOnSite');
  editLink.append(editLinkLabel, createExternalLinkIcon());

  const firstPersonViewSwitch = createLookSwitch('firstPersonView', 'firstPersonViewTitle');
  const originalTexturesSwitch = createLookSwitch('originalTextures', 'originalTexturesTitle');

  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', browser.i18n.getMessage('closeItemViewer'));
  closeButton.title = browser.i18n.getMessage('closeItemViewer');
  closeButton.append(createCloseIcon());

  const windowHeader = document.createElement('div');
  windowHeader.className = 'header';
  windowHeader.append(itemName, soundVolumeControl.controlElement, firstPersonViewSwitch, originalTexturesSwitch, editLink, closeButton);

  const viewerLook: ViewerLook = { isOriginalTextures: false, isFirstPersonView: false };
  let viewerFrame = createViewerFrame(inspectActionTarget.buildViewerFrameUrl(viewerLook, soundVolumeControl.getSoundVolume()));
  // until the frame page listens, a message is lost, and Chrome warns about one sent to the blank page before it
  let isViewerFrameListening = false;

  const viewerDialog = document.createElement('dialog');
  viewerDialog.setAttribute('aria-label', itemName.textContent);
  viewerDialog.append(windowHeader, viewerFrame);
  windowShadowRoot.append(windowStyle, viewerDialog);
  document.body.append(windowHost);
  // a modal dialog sits in the browser's top layer: above Steam's own listing dialog, with the page behind inert
  viewerDialog.showModal();
  closeButton.focus({ preventScroll: true });

  // the Steam page stays still under the window and gets its own scrolling back on close
  const pageOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';

  viewerDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeItemViewerWindow();
  });
  // Escape while the focus is outside the 3D frame; inside the frame the key belongs to the viewer.
  // Steam's market cancels Escape in its document handler, and a cancelled key never becomes the dialog's cancel
  viewerDialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    closeItemViewerWindow();
  });
  // the window fills the dialog, so a click on the dialog itself is a click on the backdrop
  viewerDialog.addEventListener('click', (event) => {
    if (event.target === viewerDialog) closeItemViewerWindow();
  });
  closeButton.addEventListener('click', () => {
    closeItemViewerWindow();
  });
  // a new frame in place of the old one: Steam's frame-src lets through a frame the extension creates,
  // but not a new address in a frame already on the page
  const showViewerLook = (): void => {
    firstPersonViewSwitch.setAttribute('aria-pressed', String(viewerLook.isFirstPersonView));
    originalTexturesSwitch.setAttribute('aria-pressed', String(viewerLook.isOriginalTextures));
    const nextViewerFrame = createViewerFrame(inspectActionTarget.buildViewerFrameUrl(viewerLook, soundVolumeControl.getSoundVolume()));
    viewerFrame.replaceWith(nextViewerFrame);
    viewerFrame = nextViewerFrame;
    isViewerFrameListening = false;
  };
  firstPersonViewSwitch.addEventListener('click', () => {
    viewerLook.isFirstPersonView = !viewerLook.isFirstPersonView;
    showViewerLook();
  });
  originalTexturesSwitch.addEventListener('click', () => {
    viewerLook.isOriginalTextures = !viewerLook.isOriginalTextures;
    showViewerLook();
  });
  // the frame says when it listens and gets the volume set while it loaded
  const handleViewerFrameMessage = (event: MessageEvent): void => {
    if (event.source !== viewerFrame.contentWindow || event.origin !== RESKINS_ORIGIN || !isReadyMessage(event.data)) return;
    isViewerFrameListening = true;
    postSoundVolume(viewerFrame, soundVolumeControl.getSoundVolume());
  };
  window.addEventListener('message', handleViewerFrameMessage);

  closeShownWindow = () => {
    closeShownWindow = null;
    window.removeEventListener('message', handleViewerFrameMessage);
    viewerDialog.close();
    // removing the frame stops the 3D and frees its memory
    windowHost.remove();
    document.documentElement.style.overflow = pageOverflow;
    if (returnFocusElement.isConnected) returnFocusElement.focus({ preventScroll: true });
  };
}

export function closeItemViewerWindow(): void {
  closeShownWindow?.();
}

/** A Steam-grey switch in the header; `aria-pressed` holds its state and its look. */
function createLookSwitch(labelMessage: 'firstPersonView' | 'originalTextures', titleMessage: 'firstPersonViewTitle' | 'originalTexturesTitle'): HTMLButtonElement {
  const lookSwitch = document.createElement('button');
  lookSwitch.className = 'steam-button';
  lookSwitch.type = 'button';
  lookSwitch.textContent = browser.i18n.getMessage(labelMessage);
  lookSwitch.title = browser.i18n.getMessage(titleMessage);
  lookSwitch.setAttribute('aria-pressed', 'false');
  return lookSwitch;
}

/** A message, not a new address: a new frame would reload the 3D on every step of the slider. */
function postSoundVolume(viewerFrame: HTMLIFrameElement, soundVolume: number): void {
  viewerFrame.contentWindow?.postMessage(buildSoundVolumeMessage(soundVolume), RESKINS_ORIGIN);
}

function createViewerFrame(viewerFrameUrl: string): HTMLIFrameElement {
  const viewerFrame = document.createElement('iframe');
  viewerFrame.src = viewerFrameUrl;
  viewerFrame.title = browser.i18n.getMessage('itemViewerTitle');
  // the frame address already holds the item; the Steam address with its profile stays on Steam
  viewerFrame.referrerPolicy = 'no-referrer';
  viewerFrame.allow = 'fullscreen';
  return viewerFrame;
}
