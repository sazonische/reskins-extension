/** A Steam page that shows CS2 items with Inspect in Game links. */
export interface SteamPageAdapter {
  /** Inspect in Game links on the page right now; Steam adds and replaces them without a reload. */
  findInspectLinks(): readonly HTMLAnchorElement[];
  /** Places the action next to the Steam link of the same item. */
  mountInspectAction(inspectLink: HTMLAnchorElement, inspectAction: HTMLElement): void;
}
