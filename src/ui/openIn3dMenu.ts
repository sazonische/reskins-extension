import { browser } from 'wxt/browser';
import { createExternalLinkIcon } from './icons';
import { openItemViewerWindow } from './itemViewerWindow';
import openIn3dMenuCss from './openIn3dMenu.css?inline';
import type { InspectActionTarget } from './types';

/** Marks our menu in Steam's DOM; the look lives inside the shadow root. */
const MENU_HOST_CLASS = 'reskins-open-in-3d-menu';

/** Space between the button and its menu. */
const MENU_OFFSET = 6;

/** The menu keeps this far from the window edges. */
const VIEWPORT_MARGIN = 8;

let closeShownMenu: (() => void) | null = null;

/** Opens the choice next to the button: the item in a window over Steam or on reskins.gg. */
export function showOpenIn3dMenu(anchorLink: HTMLElement, inspectActionTarget: InspectActionTarget): void {
  closeOpenIn3dMenu();

  const menuHost = document.createElement('div');
  menuHost.className = MENU_HOST_CLASS;
  const menuShadowRoot = menuHost.attachShadow({ mode: 'closed' });
  const menuStyle = document.createElement('style');
  menuStyle.textContent = openIn3dMenuCss;

  const windowItem = document.createElement('button');
  windowItem.type = 'button';
  windowItem.setAttribute('role', 'menuitem');
  windowItem.textContent = browser.i18n.getMessage('openIn3dInWindow');
  windowItem.addEventListener('click', () => {
    closeOpenIn3dMenu();
    openItemViewerWindow(inspectActionTarget, anchorLink);
  });

  const siteItem = document.createElement('a');
  siteItem.setAttribute('role', 'menuitem');
  siteItem.href = inspectActionTarget.itemPageUrl;
  siteItem.target = '_blank';
  // the inventory address carries the Steam profile, the site does not need it
  siteItem.rel = 'noopener noreferrer';
  const siteItemLabel = document.createElement('span');
  siteItemLabel.textContent = browser.i18n.getMessage('openIn3dOnSite');
  siteItem.append(siteItemLabel, createExternalLinkIcon());
  siteItem.addEventListener('click', () => {
    // after the browser follows the link: a link taken off the page mid-click may not open
    setTimeout(closeOpenIn3dMenu);
  });

  const menuItems = [windowItem, siteItem];
  const menuList = document.createElement('div');
  menuList.setAttribute('role', 'menu');
  menuList.append(...menuItems);
  const menuDialog = document.createElement('dialog');
  menuDialog.append(menuList);
  menuShadowRoot.append(menuStyle, menuDialog);
  document.body.append(menuHost);
  // a modal dialog sits in the browser's top layer: Steam's panels cannot clip it and its listing dialog cannot cover it
  menuDialog.showModal();
  placeMenu(menuDialog, anchorLink);
  windowItem.focus({ preventScroll: true });

  const closeMenuToAnchor = (): void => {
    closeOpenIn3dMenu();
    anchorLink.focus({ preventScroll: true });
  };
  menuDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeMenuToAnchor();
  });
  // the list fills the dialog, so a click on the dialog itself is a click outside the menu
  menuDialog.addEventListener('click', (event) => {
    if (event.target === menuDialog) closeOpenIn3dMenu();
  });
  menuDialog.addEventListener('keydown', (event) => {
    // Steam's market cancels Escape in its document handler, and a cancelled key never becomes the dialog's cancel
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeMenuToAnchor();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const focusedItemIndex = menuItems.findIndex((menuItem) => menuItem === menuShadowRoot.activeElement);
    const step = event.key === 'ArrowDown' ? 1 : -1;
    menuItems[(focusedItemIndex + step + menuItems.length) % menuItems.length]?.focus();
  });
  // the button moves away with the page, so the menu does not stay hanging in place
  const handleViewportChange = (): void => {
    closeOpenIn3dMenu();
  };
  window.addEventListener('scroll', handleViewportChange, true);
  window.addEventListener('resize', handleViewportChange);
  anchorLink.setAttribute('aria-expanded', 'true');

  closeShownMenu = () => {
    closeShownMenu = null;
    window.removeEventListener('scroll', handleViewportChange, true);
    window.removeEventListener('resize', handleViewportChange);
    anchorLink.setAttribute('aria-expanded', 'false');
    menuDialog.close();
    menuHost.remove();
  };
}

export function closeOpenIn3dMenu(): void {
  closeShownMenu?.();
}

/** Under the button by default, above it when the window has no room below; never past the window sides. */
function placeMenu(menuDialog: HTMLElement, anchorLink: HTMLElement): void {
  const anchorRect = anchorLink.getBoundingClientRect();
  menuDialog.style.minWidth = `${String(anchorRect.width)}px`;
  const menuRect = menuDialog.getBoundingClientRect();
  const spaceBelow = window.innerHeight - anchorRect.bottom;
  const shouldOpenUpward = spaceBelow < menuRect.height + MENU_OFFSET + VIEWPORT_MARGIN && anchorRect.top > spaceBelow;
  const menuTop = shouldOpenUpward ? anchorRect.top - MENU_OFFSET - menuRect.height : anchorRect.bottom + MENU_OFFSET;
  const menuLeft = Math.max(VIEWPORT_MARGIN, Math.min(anchorRect.left, window.innerWidth - menuRect.width - VIEWPORT_MARGIN));
  menuDialog.style.top = `${String(menuTop)}px`;
  menuDialog.style.left = `${String(menuLeft)}px`;
  menuDialog.dataset.placement = shouldOpenUpward ? 'above' : 'below';
}
