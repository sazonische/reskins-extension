import { defineContentScript } from 'wxt/utils/define-content-script';
import { marketPageAdapter } from '../src/steam/market/marketPageAdapter';
import { mountOpenIn3dActions } from '../src/ui/mountOpenIn3dActions';

export default defineContentScript({
  matches: ['https://steamcommunity.com/market/listings/730/*'],
  main(contentScriptContext) {
    contentScriptContext.onInvalidated(mountOpenIn3dActions(marketPageAdapter));
  },
});
