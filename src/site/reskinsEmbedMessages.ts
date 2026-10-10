/** Command the reskins.gg viewer frame takes from the page around it. */
const SOUND_VOLUME_MESSAGE_TYPE = 'reskins:sound-volume';

/** The frame sends it once its page listens: the browser drops whatever came before, so the state goes again. */
const READY_MESSAGE_TYPE = 'reskins:ready';

/** The frame changes its volume live, even for sounds already playing, without reloading the 3D. */
interface SoundVolumeMessage {
  type: typeof SOUND_VOLUME_MESSAGE_TYPE;
  /** 0..1, zero is silence. */
  volume: number;
}

export function buildSoundVolumeMessage(soundVolume: number): SoundVolumeMessage {
  return { type: SOUND_VOLUME_MESSAGE_TYPE, volume: soundVolume };
}

export function isReadyMessage(messageData: unknown): boolean {
  return typeof messageData === 'object' && messageData !== null
    && 'type' in messageData && messageData.type === READY_MESSAGE_TYPE;
}
