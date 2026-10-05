import { INSPECT_COMMAND } from '../inspect/parseInspectLinkHex';

/** An Inspect in Game link wherever Steam renders one; adapters narrow it to their containers. */
export const INSPECT_LINK_SELECTOR = `a[href*="${INSPECT_COMMAND}"]`;
