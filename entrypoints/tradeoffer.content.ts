import { defineContentScript } from 'wxt/utils/define-content-script';
import { tradeOfferPageAdapter } from '../src/steam/tradeoffer/tradeOfferPageAdapter';
import { mountOpenIn3dActions } from '../src/ui/mountOpenIn3dActions';

export default defineContentScript({
  matches: ['https://steamcommunity.com/tradeoffer/*'],
  main(contentScriptContext) {
    contentScriptContext.onInvalidated(mountOpenIn3dActions(tradeOfferPageAdapter));
  },
});
