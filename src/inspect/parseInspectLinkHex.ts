/** Game console command Steam puts in front of the item in Inspect in Game links. */
export const INSPECT_COMMAND = 'csgo_econ_action_preview';

/** Steam separates the command from its argument with a URL-encoded space. */
const ENCODED_ARGUMENT_SEPARATOR = '%20';

/** The masked item blob as Steam substitutes it from asset property 6: uppercase hex only. */
const INSPECT_LINK_HEX_PATTERN = /^[0-9A-F]+$/;

/**
 * Inspect in Game link -> item hex, handed to the site as is.
 * `null` for links without the item: old `S…A…D…` / `M…A…D…` links and unfilled `%propid:6%` templates.
 */
export function parseInspectLinkHex(inspectLinkHref: string): string | null {
  const commandIndex = inspectLinkHref.lastIndexOf(INSPECT_COMMAND);
  if (commandIndex === -1) return null;

  const commandArgument = inspectLinkHref.slice(commandIndex + INSPECT_COMMAND.length);
  const inspectLinkHex = commandArgument.startsWith(ENCODED_ARGUMENT_SEPARATOR)
    ? commandArgument.slice(ENCODED_ARGUMENT_SEPARATOR.length)
    : commandArgument.trim();
  return INSPECT_LINK_HEX_PATTERN.test(inspectLinkHex) ? inspectLinkHex : null;
}
