const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

/** A 16-unit line icon drawn in the colour of the text around it; the stylesheet of its place sets the size. */
function createLineIcon(pathData: string): SVGSVGElement {
  const lineIcon = document.createElementNS(SVG_NAMESPACE, 'svg');
  lineIcon.setAttribute('viewBox', '0 0 16 16');
  lineIcon.setAttribute('fill', 'none');
  lineIcon.setAttribute('stroke', 'currentColor');
  lineIcon.setAttribute('stroke-width', '1.8');
  lineIcon.setAttribute('stroke-linecap', 'round');
  lineIcon.setAttribute('stroke-linejoin', 'round');
  // the label next to the icon already says what it does
  lineIcon.setAttribute('aria-hidden', 'true');
  const iconPath = document.createElementNS(SVG_NAMESPACE, 'path');
  iconPath.setAttribute('d', pathData);
  lineIcon.append(iconPath);
  return lineIcon;
}

/** Points down: the button opens a menu. */
export const createChevronIcon = (): SVGSVGElement => createLineIcon('M4 6l4 4 4-4');

/** An arrow out of a box: the link leaves Steam for a new tab. */
export const createExternalLinkIcon = (): SVGSVGElement => createLineIcon('M9 3h4v4M13 3L7.5 8.5M11 9.5V13H3V5h3.5');

/** A cross: closes the window. */
export const createCloseIcon = (): SVGSVGElement => createLineIcon('M4 4l8 8M12 4l-8 8');

/** Speaker outline shared by both sound icons. */
const SPEAKER_PATH = 'M2 6h2.5L8 3v10l-3.5-3H2z';

/** A speaker with sound waves: the sound is on. */
export const createSpeakerIcon = (): SVGSVGElement => createLineIcon(`${SPEAKER_PATH}M10.5 5.8a3 3 0 0 1 0 4.4M12.5 3.8a6 6 0 0 1 0 8.4`);

/** A speaker with a cross: the sound is off. */
export const createMutedSpeakerIcon = (): SVGSVGElement => createLineIcon(`${SPEAKER_PATH}M11 6l4 4M15 6l-4 4`);
