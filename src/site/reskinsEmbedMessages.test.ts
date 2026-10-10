import { buildSoundVolumeMessage, isReadyMessage } from './reskinsEmbedMessages';

describe('buildSoundVolumeMessage', () => {
  test('sends the volume in the format the viewer frame reads', () => {
    expect(buildSoundVolumeMessage(0.35)).toEqual({ type: 'reskins:sound-volume', volume: 0.35 });
  });
});

describe('isReadyMessage', () => {
  test('recognises the signal of a frame that listens', () => {
    expect(isReadyMessage({ type: 'reskins:ready' })).toBe(true);
  });

  test('ignores other messages and values that are not messages', () => {
    for (const otherMessageData of [{ type: 'reskins:item' }, { type: 'ready' }, 'reskins:ready', null, undefined, 42]) {
      expect(isReadyMessage(otherMessageData)).toBe(false);
    }
  });
});
