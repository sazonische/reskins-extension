/** An item name as the Steam page writes it: the text and the colour Steam gives it (the rarity on the market). */
export interface SteamItemName {
  text: string;
  color: string;
}

/** A Steam page that shows CS2 items with Inspect in Game links. */
export interface SteamPageAdapter {
  /** Inspect in Game links on the page right now; Steam adds and replaces them without a reload. */
  findInspectLinks(): readonly HTMLAnchorElement[];
  /** Places the action next to the Steam link of the same item. */
  mountInspectAction(inspectLink: HTMLAnchorElement, inspectAction: HTMLElement): void;
  /** The name Steam shows for the item of this link; read when it is needed, as Steam refreshes panels in place. */
  findItemName(inspectLink: HTMLAnchorElement): SteamItemName | null;
}
