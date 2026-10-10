import { browser } from 'wxt/browser';
import { createMutedSpeakerIcon, createSpeakerIcon } from './icons';

/** The slider moves in whole percent; the frame takes 0..1. */
const PERCENT_PER_VOLUME = 100;

/** A new user hears the viewer at full volume, as the site plays it. */
const FULL_VOLUME = 1;

/** The only thing the extension stores: the window sound outlives the window and the page. */
const VIEWER_SOUND_STORAGE_KEY = 'viewerSound';

/** The level and the speaker switch apart: turning the sound back on returns the level it had. */
interface ViewerSound {
  volume: number;
  isMuted: boolean;
}

function isViewerSound(storedValue: unknown): storedValue is ViewerSound {
  return typeof storedValue === 'object' && storedValue !== null
    && 'volume' in storedValue && typeof storedValue.volume === 'number'
    && storedValue.volume >= 0 && storedValue.volume <= FULL_VOLUME
    && 'isMuted' in storedValue && typeof storedValue.isMuted === 'boolean';
}

async function findSavedViewerSound(): Promise<ViewerSound | null> {
  const storedValues = await browser.storage.local.get(VIEWER_SOUND_STORAGE_KEY);
  const savedViewerSound = storedValues[VIEWER_SOUND_STORAGE_KEY];
  return isViewerSound(savedViewerSound) ? savedViewerSound : null;
}

interface SoundVolumeControl {
  controlElement: HTMLDivElement;
  /** What the frame should play at: zero while the sound is off. */
  getSoundVolume(): number;
}

/** Speaker switch and volume slider for the window header; reads the saved sound first, the first frame starts with it. */
export async function createSoundVolumeControl(onSoundVolumeChange: (soundVolume: number) => void): Promise<SoundVolumeControl> {
  const viewerSound = await findSavedViewerSound() ?? { volume: FULL_VOLUME, isMuted: false };

  const muteButton = document.createElement('button');
  muteButton.className = 'mute-button';
  muteButton.type = 'button';

  const volumeSlider = document.createElement('input');
  volumeSlider.className = 'volume-slider';
  volumeSlider.type = 'range';
  volumeSlider.min = '0';
  volumeSlider.max = String(PERCENT_PER_VOLUME);
  volumeSlider.title = browser.i18n.getMessage('soundVolume');
  volumeSlider.setAttribute('aria-label', browser.i18n.getMessage('soundVolume'));

  const controlElement = document.createElement('div');
  controlElement.className = 'sound-volume';
  controlElement.append(muteButton, volumeSlider);

  const getSoundVolume = (): number => (viewerSound.isMuted ? 0 : viewerSound.volume);

  const showViewerSound = (): void => {
    const soundVolume = getSoundVolume();
    const isSilent = soundVolume === 0;
    const muteButtonLabel = browser.i18n.getMessage(isSilent ? 'soundOn' : 'soundOff');
    muteButton.replaceChildren(isSilent ? createMutedSpeakerIcon() : createSpeakerIcon());
    muteButton.title = muteButtonLabel;
    muteButton.setAttribute('aria-label', muteButtonLabel);
    // the slider shows what the frame plays: zero while muted, the level waits in viewerSound
    const volumePercent = Math.round(soundVolume * PERCENT_PER_VOLUME);
    volumeSlider.value = String(volumePercent);
    // Chromium has no pseudo-element for the filled part of the track
    volumeSlider.style.setProperty('--volume-percent', `${String(volumePercent)}%`);
  };

  const saveViewerSound = (): void => {
    browser.storage.local.set({ [VIEWER_SOUND_STORAGE_KEY]: viewerSound }).catch((error: unknown) => {
      console.warn('[reskins] the viewer sound was not saved', error);
    });
  };

  muteButton.addEventListener('click', () => {
    if (getSoundVolume() > 0) {
      viewerSound.isMuted = true;
    } else {
      viewerSound.isMuted = false;
      // the slider was pulled down to zero: there is no level to return to
      if (viewerSound.volume === 0) viewerSound.volume = FULL_VOLUME;
    }
    showViewerSound();
    onSoundVolumeChange(getSoundVolume());
    saveViewerSound();
  });
  volumeSlider.addEventListener('input', () => {
    viewerSound.volume = Number(volumeSlider.value) / PERCENT_PER_VOLUME;
    viewerSound.isMuted = false;
    showViewerSound();
    onSoundVolumeChange(getSoundVolume());
  });
  // one save when the slider is let go, not one per step
  volumeSlider.addEventListener('change', saveViewerSound);

  showViewerSound();
  return { controlElement, getSoundVolume };
}
