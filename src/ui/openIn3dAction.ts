import { browser } from 'wxt/browser';
import openIn3dActionCss from './openIn3dAction.css?inline';

/** Marks our element in Steam's DOM; the look lives inside the shadow root. */
const ACTION_HOST_CLASS = 'reskins-open-in-3d';

/** Gap between Steam's own action buttons: `--spacing-2` of its new UI. */
const STEAM_ACTION_GAP = '8px';

/** Layout rounds widths to fractions of a pixel: a full-width link may measure this much short. */
const SUBPIXEL_TOLERANCE = 1;

/** Link that opens the item on reskins.gg in a new tab. */
export function createOpenIn3dAction(reskinsItemUrl: string): HTMLElement {
  const actionHost = document.createElement('span');
  actionHost.className = ACTION_HOST_CLASS;
  // closed shadow root: Steam's CSS and scripts do not reach the link
  const actionShadowRoot = actionHost.attachShadow({ mode: 'closed' });

  const actionStyle = document.createElement('style');
  actionStyle.textContent = openIn3dActionCss;

  const actionLink = document.createElement('a');
  actionLink.href = reskinsItemUrl;
  actionLink.target = '_blank';
  // the inventory address carries the Steam profile, the site does not need it
  actionLink.rel = 'noopener noreferrer';
  actionLink.textContent = browser.i18n.getMessage('openIn3dAction');
  actionLink.title = browser.i18n.getMessage('openIn3dActionTitle');

  actionShadowRoot.append(actionStyle, actionLink);
  return actionHost;
}

/**
 * Gives the mounted action the size of the Steam link and Steam's spacing between buttons.
 * Steam draws that link as a compact button in its new UI and as a padded text link on the classic market.
 */
export function matchSteamLinkLook(openIn3dAction: HTMLElement, inspectLink: HTMLAnchorElement): void {
  const linkStyle = getComputedStyle(inspectLink);
  const linkHeight = inspectLink.getBoundingClientRect().height;
  // an inline link paints its body around the text, its line-height does not reach the body
  const isInlineLink = linkStyle.display === 'inline';
  const actionContainer = openIn3dAction.parentElement;
  // flex rows of the new UI space buttons with a gap, the classic text block does not
  const hasContainerGap = actionContainer !== null
    && Number.parseFloat(getComputedStyle(actionContainer).columnGap) > 0;
  // a full-width button in a column of buttons (MarketApp's item panel) gets a full-width neighbour
  const isFullWidthInColumn = actionContainer !== null && spansButtonColumn(inspectLink, actionContainer);

  // custom properties read by openIn3dAction.css
  const steamLookProperties: Record<string, string> = {
    '--steam-link-padding': `0 ${linkStyle.paddingRight} 0 ${linkStyle.paddingLeft}`,
    '--steam-link-line-height': isInlineLink ? 'normal' : linkStyle.lineHeight,
    '--steam-link-radius': linkStyle.borderRadius,
    '--steam-link-font-size': linkStyle.fontSize,
    '--steam-link-font-weight': linkStyle.fontWeight,
    '--steam-action-gap': hasContainerGap ? '0px' : STEAM_ACTION_GAP,
    '--steam-link-width': isFullWidthInColumn ? '100%' : 'auto',
  };
  // a link in a hidden panel measures 0, the stylesheet fallback fits it then
  if (linkHeight > 0) steamLookProperties['--steam-link-height'] = `${String(linkHeight)}px`;

  for (const [propertyName, propertyValue] of Object.entries(steamLookProperties)) {
    openIn3dAction.style.setProperty(propertyName, propertyValue);
  }
}

/** The link fills the whole width of a container that stacks its buttons vertically. */
function spansButtonColumn(inspectLink: HTMLAnchorElement, linkContainer: HTMLElement): boolean {
  const containerStyle = getComputedStyle(linkContainer);
  const isColumn = containerStyle.display.includes('flex') && containerStyle.flexDirection.startsWith('column');
  const containerContentWidth = linkContainer.clientWidth
    - Number.parseFloat(containerStyle.paddingLeft)
    - Number.parseFloat(containerStyle.paddingRight);
  const linkWidth = inspectLink.getBoundingClientRect().width;
  return isColumn && linkWidth > 0 && linkWidth >= containerContentWidth - SUBPIXEL_TOLERANCE;
}
