import type { ViewerLook } from '../site/reskinsUrls';
import type { SteamItemName } from '../steam/types';

/** What the action opens: the item page on reskins.gg, the frame of its 3D viewer and the name Steam gives it. */
export interface InspectActionTarget {
  itemPageUrl: string;
  /** The viewer frame address for a look and the volume it starts at: the window's switches ask for a new frame. */
  buildViewerFrameUrl(viewerLook: ViewerLook, soundVolume: number): string;
  /** Read on opening: Steam swaps the item in its panels without a reload. */
  findItemName(): SteamItemName | null;
}
